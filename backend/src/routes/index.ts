import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';
import availabilityRoutes from './availability.routes';
import messageRoutes from './message.routes';
import portfolioRoutes from './portfolio.routes';
import paymentRoutes from './payment.routes';
import reviewRoutes from './review.routes';
import statsRoutes from './stats.routes';
import aiRoutes from './ai.routes';
import notificationRoutes from './notification.routes';
import webhookRoutes from './webhook.routes';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));

  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/providers' });
  app.register(serviceRoutes, { prefix: '/services' });
  app.register(bookingRoutes, { prefix: '/bookings' });
  app.register(availabilityRoutes, { prefix: '/availability' });
  app.register(messageRoutes, { prefix: '/messages' });
  app.register(portfolioRoutes, { prefix: '/portfolio' });
  app.register(paymentRoutes, { prefix: '/payments' });
  app.register(reviewRoutes, { prefix: '/reviews' });
  app.register(statsRoutes, { prefix: '/stats' });
  app.register(aiRoutes, { prefix: '/ai' });
  app.register(notificationRoutes, { prefix: '/notifications' });
  app.register(webhookRoutes, { prefix: '/webhooks' });
}
