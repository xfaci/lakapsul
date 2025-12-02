import { FastifyInstance } from 'fastify';
import { n8nWebhook, stripeWebhook } from '../controllers/webhook.controller';

export default async function webhookRoutes(app: FastifyInstance) {
  app.post('/stripe', { config: { rawBody: true } }, stripeWebhook);
  app.post('/n8n/:topic', n8nWebhook);
}
