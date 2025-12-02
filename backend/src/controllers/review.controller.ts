import { FastifyReply, FastifyRequest } from 'fastify';

export const postReview = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'post review placeholder' });
};
