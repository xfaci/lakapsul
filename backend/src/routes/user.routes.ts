import { FastifyInstance } from 'fastify';
import { listProviders, getProviderById, getProfile, updateProfile } from '../controllers/user.controller';

export default async function userRoutes(app: FastifyInstance) {
  // Provider search
  app.get('/', listProviders);
  app.get('/:id', getProviderById);
}

export async function profileRoutes(app: FastifyInstance) {
  app.get('/:username', getProfile);
  app.put('/me', updateProfile);
}
