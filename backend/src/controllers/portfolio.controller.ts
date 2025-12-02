import { FastifyReply, FastifyRequest } from 'fastify';

export const uploadPortfolio = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'upload portfolio placeholder' });
};
