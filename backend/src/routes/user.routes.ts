import { FastifyInstance } from 'fastify';
import { getMe, getProviderById, listProviders } from '../controllers/user.controller';
import { authGuard } from '../middlewares/authGuard';

export default async function userRoutes(app: FastifyInstance) {
  app.get('/me', { preHandler: [authGuard] }, getMe);
  app.get('/', listProviders);
  app.get('/:id', getProviderById);
}
