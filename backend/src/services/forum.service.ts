import prisma from '../config/prisma';

export interface CreateThreadPayload {
    categoryId: string;
    title: string;
    content: string;
}

export interface CreatePostPayload {
    threadId: string;
    content: string;
}

export const forumService = {
    async getCategories() {
        const categories = await prisma.forumCategory.findMany({
            include: {
                _count: {
                    select: { threads: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return categories;
    },

    async getThreads(categoryId?: string, limit = 20, offset = 0) {
        const where = categoryId ? { categoryId } : {};

        const threads = await prisma.forumThread.findMany({
            where,
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                username: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
            skip: offset,
        });

        const total = await prisma.forumThread.count({ where });

        return { threads, total };
    },

    async getThreadById(threadId: string) {
        // Increment view count
        await prisma.forumThread.update({
            where: { id: threadId },
            data: { views: { increment: 1 } },
        });

        const thread = await prisma.forumThread.findUnique({
            where: { id: threadId },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                username: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                posts: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                profile: {
                                    select: {
                                        username: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        return thread;
    },

    async createThread(authorId: string, payload: CreateThreadPayload) {
        const { categoryId, title, content } = payload;

        const thread = await prisma.forumThread.create({
            data: {
                categoryId,
                authorId,
                title,
                content,
            },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                username: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        return thread;
    },

    async createPost(authorId: string, payload: CreatePostPayload) {
        const { threadId, content } = payload;

        // Check if thread exists and is not locked
        const thread = await prisma.forumThread.findUnique({
            where: { id: threadId },
        });

        if (!thread) {
            throw new Error('THREAD_NOT_FOUND');
        }

        if (thread.isLocked) {
            throw new Error('THREAD_LOCKED');
        }

        const post = await prisma.forumPost.create({
            data: {
                threadId,
                authorId,
                content,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                username: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        // Update thread's updatedAt
        await prisma.forumThread.update({
            where: { id: threadId },
            data: { updatedAt: new Date() },
        });

        return post;
    },

    async seedCategories() {
        const categories = [
            { name: 'Général', slug: 'general', description: 'Discussions générales' },
            { name: 'Matériel & Studio', slug: 'materiel', description: 'Parlons équipement!' },
            { name: 'Collaborations', slug: 'collabs', description: 'Trouvez des collaborateurs' },
            { name: 'Feedback', slug: 'feedback', description: 'Partagez vos créations' },
        ];

        for (const cat of categories) {
            await prisma.forumCategory.upsert({
                where: { slug: cat.slug },
                update: {},
                create: cat,
            });
        }

        return { success: true };
    },
};
