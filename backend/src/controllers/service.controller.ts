import { FastifyReply, FastifyRequest } from 'fastify';

export const createService = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'create service placeholder' });
};

export const listServicesByUser = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ userId: (request.params as { userId: string }).userId, services: [] });
};
