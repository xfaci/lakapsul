import { FastifyReply, FastifyRequest } from 'fastify';

export const listNotifications = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ notifications: [] });
};
