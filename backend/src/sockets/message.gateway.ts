import { Server, Socket } from 'socket.io';

export function registerMessageGateway(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('message:send', (payload) => {
      socket.to(payload.conversationId).emit('message:new', payload);
    });

    socket.on('conversation:join', (conversationId: string) => {
      socket.join(conversationId);
    });
  });
}
