import { FastifyInstance } from 'fastify';
import { listMessages, postMessage } from '../controllers/message.controller';
import { authGuard } from '../middlewares/authGuard';

export default async function messageRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authGuard] }, listMessages);
  app.post('/', { preHandler: [authGuard] }, postMessage);
}
