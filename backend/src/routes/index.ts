import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';
import userRoutes, { profileRoutes } from './user.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';
import forumRoutes from './forum.routes';
import messageRoutes from './message.routes';
import portfolioRoutes from './portfolio.routes';
import paymentRoutes from './payment.routes';
import reviewRoutes from './review.routes';
import statsRoutes from './stats.routes';
import aiRoutes from './ai.routes';
import notificationRoutes from './notification.routes';
import webhookRoutes from './webhook.routes';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Core routes
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/providers' });
  app.register(profileRoutes, { prefix: '/profiles' });
  app.register(serviceRoutes, { prefix: '/services' });
  app.register(bookingRoutes, { prefix: '/bookings' });
  app.register(forumRoutes, { prefix: '/forum' });

  // Messaging & Notifications
  app.register(messageRoutes, { prefix: '/messages' });
  app.register(notificationRoutes, { prefix: '/notifications' });

  // Media & Portfolio
  app.register(portfolioRoutes, { prefix: '/portfolio' });

  // Reviews & Stats
  app.register(reviewRoutes, { prefix: '/reviews' });
  app.register(statsRoutes, { prefix: '/stats' });

  // Payments & AI
  app.register(paymentRoutes, { prefix: '/payments' });
  app.register(aiRoutes, { prefix: '/ai' });

  // Webhooks
  app.register(webhookRoutes, { prefix: '/webhooks' });
}
