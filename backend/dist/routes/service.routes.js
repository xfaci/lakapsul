import { createService, listServicesByUser } from '../controllers/service.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function serviceRoutes(app) {
    app.post('/', { preHandler: [authGuard] }, createService);
    app.get('/:userId', listServicesByUser);
}
