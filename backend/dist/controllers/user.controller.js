export const getMe = async (_request, reply) => {
    reply.send({ message: 'me placeholder' });
};
export const listProviders = async (_request, reply) => {
    reply.send({ providers: [] });
};
export const getProviderById = async (request, reply) => {
    reply.send({ providerId: request.params.id });
};
