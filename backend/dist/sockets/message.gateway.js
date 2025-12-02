export function registerMessageGateway(io) {
    io.on('connection', (socket) => {
        socket.on('message:send', (payload) => {
            socket.to(payload.conversationId).emit('message:new', payload);
        });
        socket.on('conversation:join', (conversationId) => {
            socket.join(conversationId);
        });
    });
}
