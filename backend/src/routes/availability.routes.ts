import { FastifyInstance } from 'fastify';
import { updateAvailability } from '../controllers/availability.controller';
import { authGuard } from '../middlewares/authGuard';

export default async function availabilityRoutes(app: FastifyInstance) {
  app.put('/', { preHandler: [authGuard] }, updateAvailability);
}
