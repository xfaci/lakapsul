import { FastifyReply, FastifyRequest } from 'fastify';
import { bookingService } from '../services/booking.service';
import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

const createBookingSchema = z.object({
  serviceId: z.string(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});

export const createBooking = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId } = request.user as { userId: string };
    const body = createBookingSchema.parse(request.body);

    const booking = await bookingService.create(userId, body);
    reply.status(201).send({ success: true, booking });
  } catch (error: any) {
    if (error.message === 'SERVICE_NOT_FOUND') {
      return reply.status(404).send({ error: 'Service non trouvé' });
    }
    throw error;
  }
};

export const listMyBookings = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId, role } = request.user as { userId: string; role: string };
    const query = request.query as { type?: 'artist' | 'provider' };

    const bookingRole = query.type || (role === 'PROVIDER' ? 'provider' : 'artist');
    const bookings = await bookingService.listByUser(userId, bookingRole);

    reply.send({ bookings });
  } catch {
    reply.status(401).send({ error: 'Non authentifié' });
  }
};

export const listIncomingBookings = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId, role } = request.user as { userId: string; role: string };

    if (role !== 'PROVIDER') {
      return reply.status(403).send({ error: 'Réservé aux prestataires' });
    }

    const bookings = await bookingService.listIncoming(userId);
    reply.send({ bookings });
  } catch {
    reply.status(401).send({ error: 'Non authentifié' });
  }
};

export const updateBookingStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    const { status } = updateStatusSchema.parse(request.body);

    const booking = await bookingService.updateStatus(id, userId, status as BookingStatus);
    reply.send({ success: true, booking });
  } catch (error: any) {
    if (error.message === 'BOOKING_NOT_FOUND') {
      return reply.status(404).send({ error: 'Réservation non trouvée' });
    }
    if (error.message === 'UNAUTHORIZED') {
      return reply.status(403).send({ error: 'Non autorisé' });
    }
    throw error;
  }
};

export const getBookingById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };

    const booking = await bookingService.getById(id);
    if (!booking) {
      return reply.status(404).send({ error: 'Réservation non trouvée' });
    }

    // Check ownership
    if (booking.artistId !== userId && booking.providerId !== userId) {
      return reply.status(403).send({ error: 'Non autorisé' });
    }

    reply.send(booking);
  } catch {
    reply.status(401).send({ error: 'Non authentifié' });
  }
};
