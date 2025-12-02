import { FastifyInstance } from 'fastify';
import { createService, listServicesByUser } from '../controllers/service.controller';
import { authGuard } from '../middlewares/authGuard';

export default async function serviceRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [authGuard] }, createService);
  app.get('/:userId', listServicesByUser);
}
