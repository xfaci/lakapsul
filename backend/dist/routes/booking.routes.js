import { createBooking, listBookings, listIncomingBookings } from '../controllers/booking.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function bookingRoutes(app) {
    app.post('/', { preHandler: [authGuard] }, createBooking);
    app.get('/', { preHandler: [authGuard] }, listBookings);
    app.get('/incoming', { preHandler: [authGuard] }, listIncomingBookings);
}
