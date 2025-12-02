import { FastifyReply, FastifyRequest } from 'fastify';

export const aiManager = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'ai manager placeholder' });
};

export const aiRecommendations = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ recommendations: [] });
};

export const aiCreativePath = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ steps: [] });
};
