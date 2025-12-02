import { FastifyReply, FastifyRequest } from 'fastify';

export const listMessages = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ messages: [] });
};

export const postMessage = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'post message placeholder' });
};
