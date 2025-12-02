export const createService = async (_request, reply) => {
    reply.send({ message: 'create service placeholder' });
};
export const listServicesByUser = async (request, reply) => {
    reply.send({ userId: request.params.userId, services: [] });
};
