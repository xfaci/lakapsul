import { FastifyInstance } from 'fastify';
import {
  createBooking,
  listMyBookings,
  listIncomingBookings,
  updateBookingStatus,
  getBookingById
} from '../controllers/booking.controller';

export default async function bookingRoutes(app: FastifyInstance) {
  app.post('/', createBooking);
  app.get('/me', listMyBookings);
  app.get('/incoming', listIncomingBookings);
  app.get('/:id', getBookingById);
  app.patch('/:id/status', updateBookingStatus);
}
