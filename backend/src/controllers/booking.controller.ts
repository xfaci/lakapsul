import { FastifyReply, FastifyRequest } from 'fastify';

export const createBooking = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'create booking placeholder' });
};

export const listBookings = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ bookings: [] });
};

export const listIncomingBookings = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ bookings: [] });
};
