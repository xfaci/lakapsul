import { Server } from 'socket.io';
import http from 'http';
import { env } from '../config/env';

export function setupSocketIO(httpServer: http.Server) {
  const origins = env.CLIENT_URL?.split(',').map((o: string) => o.trim()) || '*';

  const io = new Server(httpServer, {
    cors: {
      origin: origins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user's room for notifications
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Chat functionality
    socket.on('joinConversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('sendMessage', (data: { conversationId: string; message: string }) => {
      io.to(`conversation:${data.conversationId}`).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
