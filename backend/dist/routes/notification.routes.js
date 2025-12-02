import { listNotifications } from '../controllers/notification.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function notificationRoutes(app) {
    app.get('/', { preHandler: [authGuard] }, listNotifications);
}
