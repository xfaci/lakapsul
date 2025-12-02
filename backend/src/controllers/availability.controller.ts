import { FastifyReply, FastifyRequest } from 'fastify';

export const updateAvailability = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'update availability placeholder' });
};
