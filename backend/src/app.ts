import fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env';
import { logger } from './config/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';

export function buildApp() {
  const app = fastify({
    logger,
    ajv: {
      customOptions: {
        removeAdditional: true,
        coerceTypes: true
      }
    }
  });

  // CORS
  app.register(cors, {
    origin: env.CLIENT_URL || true,
    credentials: true
  });

  // Form body parser
  app.register(formbody);

  // JWT
  app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN
    }
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  // Swagger documentation
  app.register(swagger, {
    openapi: {
      info: {
        title: 'La Kapsul API',
        version: '0.1.0',
        description: 'API Backend pour La Kapsul - Plateforme de mise en relation artistes/prestataires'
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' }
  });

  // Register all routes
  app.register(registerRoutes, { prefix: '/api' });

  return app;
}
