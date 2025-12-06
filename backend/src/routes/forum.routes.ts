import { FastifyInstance } from 'fastify';
import {
    getCategories,
    getThreads,
    getThreadById,
    createThread,
    createPost,
    seedCategories
} from '../controllers/forum.controller';

export default async function forumRoutes(app: FastifyInstance) {
    app.get('/categories', getCategories);
    app.get('/threads', getThreads);
    app.post('/threads', createThread);
    app.get('/threads/:id', getThreadById);
    app.post('/threads/:id/reply', createPost);

    // Admin only - seed initial categories
    app.post('/seed', seedCategories);
}
