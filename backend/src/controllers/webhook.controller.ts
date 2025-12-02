import { FastifyReply, FastifyRequest } from 'fastify';

export const stripeWebhook = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ received: true });
};

export const n8nWebhook = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ received: true });
};
