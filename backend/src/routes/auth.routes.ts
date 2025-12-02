import { FastifyInstance } from 'fastify';
import { login, oauthApple, oauthGoogle, refreshToken, signup } from '../controllers/auth.controller';

export default async function authRoutes(app: FastifyInstance) {
  app.post('/signup', signup);
  app.post('/login', login);
  app.post('/refresh', refreshToken);
  app.get('/google/callback', oauthGoogle);
  app.get('/apple/callback', oauthApple);
}
