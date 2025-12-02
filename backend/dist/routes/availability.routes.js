import { updateAvailability } from '../controllers/availability.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function availabilityRoutes(app) {
    app.put('/', { preHandler: [authGuard] }, updateAvailability);
}
