import prisma from '../config/prisma';
import { BookingStatus } from '@prisma/client';

export interface CreateBookingPayload {
  serviceId: string;
  date: string; // ISO date string
  notes?: string;
}

export const bookingService = {
  async create(artistId: string, payload: CreateBookingPayload) {
    const { serviceId, date, notes } = payload;

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        profile: {
          include: { user: true },
        },
      },
    });

    if (!service) {
      throw new Error('SERVICE_NOT_FOUND');
    }

    const providerId = service.profile.userId;

    // Calculate end date based on duration
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);

    const booking = await prisma.booking.create({
      data: {
        artistId,
        providerId,
        serviceId,
        date: startDate,
        endDate,
        amount: service.price,
        notes,
        status: 'PENDING',
      },
      include: {
        service: true,
        provider: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        artist: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Create notification for provider
    await prisma.notification.create({
      data: {
        userId: providerId,
        type: 'NEW_BOOKING',
        title: 'Nouvelle réservation',
        message: `Vous avez une nouvelle demande de réservation pour "${service.title}"`,
        data: { bookingId: booking.id },
      },
    });

    return booking;
  },

  async listByUser(userId: string, role: 'artist' | 'provider') {
    const where = role === 'artist' ? { artistId: userId } : { providerId: userId };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        provider: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        artist: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return bookings;
  },

  async listIncoming(providerId: string) {
    const bookings = await prisma.booking.findMany({
      where: {
        providerId,
        status: 'PENDING',
      },
      include: {
        service: true,
        artist: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings;
  },

  async updateStatus(bookingId: string, userId: string, status: BookingStatus) {
    // Only provider can update status
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error('BOOKING_NOT_FOUND');
    }

    if (booking.providerId !== userId && booking.artistId !== userId) {
      throw new Error('UNAUTHORIZED');
    }

    // Provider can confirm/cancel, Artist can cancel
    if (booking.providerId !== userId && status !== 'CANCELLED') {
      throw new Error('UNAUTHORIZED');
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Notify the other party
    const notifyUserId = userId === booking.providerId ? booking.artistId : booking.providerId;
    const notificationType = status === 'CONFIRMED' ? 'BOOKING_CONFIRMED' : 'BOOKING_CANCELLED';

    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: notificationType,
        title: status === 'CONFIRMED' ? 'Réservation confirmée' : 'Réservation annulée',
        message: status === 'CONFIRMED'
          ? 'Votre réservation a été confirmée!'
          : 'Votre réservation a été annulée.',
        data: { bookingId },
      },
    });

    return updated;
  },

  async getById(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        provider: {
          select: {
            id: true,
            profile: true,
          },
        },
        artist: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });
  },
};
