import prisma from '../config/prisma';

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  skills?: string[];
}

export interface SearchProvidersParams {
  skills?: string[];
  location?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const userService = {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            services: true,
            media: true,
          },
        },
      },
    });
    return user;
  },

  async listProviders(params: SearchProvidersParams) {
    const { skills, location, search, limit = 20, offset = 0 } = params;

    const where: any = {
      user: {
        role: 'PROVIDER',
      },
    };

    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const profiles = await prisma.profile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        services: {
          where: { isActive: true },
          take: 3,
        },
        media: {
          take: 3,
        },
      },
      take: limit,
      skip: offset,
      orderBy: { rating: 'desc' },
    });

    const total = await prisma.profile.count({ where });

    return { profiles, total };
  },

  async getProviderById(id: string) {
    const profile = await prisma.profile.findFirst({
      where: {
        OR: [
          { id },
          { username: id },
          { userId: id },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        services: {
          where: { isActive: true },
        },
        media: true,
      },
    });

    if (!profile) {
      throw new Error('PROVIDER_NOT_FOUND');
    }

    // Get reviews for this provider
    const reviews = await prisma.review.findMany({
      where: { targetId: profile.userId },
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
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return { ...profile, reviews };
  },

  async getByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
        services: true,
        media: true,
      },
    });
    return profile;
  },

  async updateProfile(userId: string, data: UpdateProfilePayload) {
    const profile = await prisma.profile.update({
      where: { userId },
      data,
    });
    return profile;
  },
};
