import { FastifyReply, FastifyRequest } from 'fastify';

export const createPaymentIntent = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'create payment intent placeholder' });
};

export const connectOnboarding = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'connect onboarding placeholder' });
};
