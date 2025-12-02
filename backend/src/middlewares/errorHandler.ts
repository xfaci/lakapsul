import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (error: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    statusCode,
    error: error.name,
    message: error.message || 'Internal server error'
  });
};
