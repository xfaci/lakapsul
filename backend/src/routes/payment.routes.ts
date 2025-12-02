import { FastifyInstance } from 'fastify';
import { connectOnboarding, createPaymentIntent } from '../controllers/payment.controller';
import { authGuard } from '../middlewares/authGuard';

export default async function paymentRoutes(app: FastifyInstance) {
  app.post('/create-intent', { preHandler: [authGuard] }, createPaymentIntent);
  app.post('/connect/onboarding', { preHandler: [authGuard] }, connectOnboarding);
}
