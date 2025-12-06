import { FastifyReply, FastifyRequest } from 'fastify';
import { forumService } from '../services/forum.service';
import { z } from 'zod';

const createThreadSchema = z.object({
    categoryId: z.string(),
    title: z.string().min(5).max(200),
    content: z.string().min(10),
});

const createPostSchema = z.object({
    content: z.string().min(1),
});

export const getCategories = async (_request: FastifyRequest, reply: FastifyReply) => {
    const categories = await forumService.getCategories();
    reply.send({ categories });
};

export const getThreads = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
        categoryId?: string;
        limit?: string;
        offset?: string;
    };

    const result = await forumService.getThreads(
        query.categoryId,
        query.limit ? parseInt(query.limit) : 20,
        query.offset ? parseInt(query.offset) : 0
    );

    reply.send(result);
};

export const getThreadById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const thread = await forumService.getThreadById(id);
    if (!thread) {
        return reply.status(404).send({ error: 'Sujet non trouvé' });
    }

    reply.send(thread);
};

export const createThread = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
        const { userId } = request.user as { userId: string };
        const body = createThreadSchema.parse(request.body);

        const thread = await forumService.createThread(userId, body);
        reply.status(201).send({ success: true, thread });
    } catch {
        reply.status(401).send({ error: 'Non authentifié' });
    }
};

export const createPost = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
        const { userId } = request.user as { userId: string };
        const { id: threadId } = request.params as { id: string };
        const { content } = createPostSchema.parse(request.body);

        const post = await forumService.createPost(userId, { threadId, content });
        reply.status(201).send({ success: true, post });
    } catch (error: any) {
        if (error.message === 'THREAD_NOT_FOUND') {
            return reply.status(404).send({ error: 'Sujet non trouvé' });
        }
        if (error.message === 'THREAD_LOCKED') {
            return reply.status(403).send({ error: 'Ce sujet est verrouillé' });
        }
        throw error;
    }
};

export const seedCategories = async (_request: FastifyRequest, reply: FastifyReply) => {
    await forumService.seedCategories();
    reply.send({ success: true, message: 'Catégories créées' });
};
