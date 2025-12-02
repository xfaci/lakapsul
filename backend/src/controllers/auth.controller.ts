import { FastifyReply, FastifyRequest } from 'fastify';

export const signup = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'signup placeholder' });
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'login placeholder' });
};

export const refreshToken = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'refresh token placeholder' });
};

export const oauthGoogle = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'oauth google placeholder' });
};

export const oauthApple = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'oauth apple placeholder' });
};
