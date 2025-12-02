import fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import jwt from '@fastify/jwt';
import rawBody from '@fastify/raw-body';
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
    app.register(rawBody, { field: 'rawBody', global: false, encoding: 'utf8', runFirst: true });
    app.register(cors, { origin: env.CLIENT_URL || true, credentials: true });
    app.register(formbody);
    app.register(jwt, { secret: env.JWT_SECRET });
    app.setErrorHandler(errorHandler);
    app.register(swagger, {
        openapi: {
            info: { title: 'La Kapsul API', version: '0.1.0' }
        }
    });
    app.register(swaggerUi, { routePrefix: '/docs', uiConfig: { docExpansion: 'list' } });
    app.register(registerRoutes, { prefix: '/api' });
    return app;
}
