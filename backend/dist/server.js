import { buildApp } from './app';
import { env } from './config/env';
import { attachSockets } from './sockets';
async function start() {
    const app = buildApp();
    try {
        const address = await app.listen({ port: env.PORT, host: env.HOST });
        attachSockets(app.server);
        app.log.info(`API listening on ${address}`);
    }
    catch (err) {
        app.log.error(err, 'Failed to start server');
        process.exit(1);
    }
}
start();
