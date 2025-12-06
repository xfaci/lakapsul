import prisma from '../config/prisma';
import { ServiceType } from '@prisma/client';

export interface CreateServicePayload {
  title: string;
  description?: string;
  price: number;
  duration: number;
  type: ServiceType;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  type?: ServiceType;
  isActive?: boolean;
}

export const serviceService = {
  async create(profileId: string, data: CreateServicePayload) {
    const service = await prisma.service.create({
      data: {
        ...data,
        profileId,
      },
    });
    return service;
  },

  async listByProfile(profileId: string) {
    const services = await prisma.service.findMany({
      where: {
        profileId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return services;
  },

  async listByProvider(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error('PROFILE_NOT_FOUND');
    }

    const services = await prisma.service.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });

    return services;
  },

  async getById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return service;
  },

  async update(id: string, userId: string, data: UpdateServicePayload) {
    // Verify ownership
    const service = await prisma.service.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!service || service.profile.userId !== userId) {
      throw new Error('UNAUTHORIZED');
    }

    const updated = await prisma.service.update({
      where: { id },
      data,
    });

    return updated;
  },

  async delete(id: string, userId: string) {
    // Verify ownership
    const service = await prisma.service.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!service || service.profile.userId !== userId) {
      throw new Error('UNAUTHORIZED');
    }

    await prisma.service.delete({ where: { id } });
    return { success: true };
  },
};
