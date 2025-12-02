import { FastifyReply, FastifyRequest } from 'fastify';

export const getMe = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'me placeholder' });
};

export const listProviders = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ providers: [] });
};

export const getProviderById = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ providerId: (request.params as { id: string }).id });
};
