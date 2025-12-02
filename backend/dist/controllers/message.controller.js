export const listMessages = async (_request, reply) => {
    reply.send({ messages: [] });
};
export const postMessage = async (_request, reply) => {
    reply.send({ message: 'post message placeholder' });
};
