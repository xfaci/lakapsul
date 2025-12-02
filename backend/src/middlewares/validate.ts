import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => async (request: FastifyRequest, reply: FastifyReply) => {
  const result = schema.safeParse({
    body: request.body,
    query: request.query,
    params: request.params
  });

  if (!result.success) {
    reply.status(400).send({ message: 'Validation error', issues: result.error.flatten() });
  }
};
