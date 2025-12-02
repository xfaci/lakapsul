import { getCharts, getStats } from '../controllers/stats.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function statsRoutes(app) {
    app.get('/', { preHandler: [authGuard] }, getStats);
    app.get('/charts', { preHandler: [authGuard] }, getCharts);
}
