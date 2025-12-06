import { FastifyInstance } from 'fastify';
import { FastifyReply, FastifyRequest } from 'fastify';

const stripeWebhook = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'Stripe webhook - à configurer avec Stripe' });
};

export default async function webhookRoutes(app: FastifyInstance) {
  app.post('/stripe', stripeWebhook);
}
