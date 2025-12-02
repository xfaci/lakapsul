import { Server } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../config/logger';
export function attachSockets(httpServer) {
    const origins = env.SOCKET_ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || '*';
    const io = new Server(httpServer, {
        cors: {
            origin: origins,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        logger.info({ socketId: socket.id }, 'socket connected');
    });
    return io;
}
