import { aiCreativePath, aiManager, aiRecommendations } from '../controllers/ai.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function aiRoutes(app) {
    app.post('/manager', { preHandler: [authGuard] }, aiManager);
    app.post('/recommendations', { preHandler: [authGuard] }, aiRecommendations);
    app.get('/creative-path', { preHandler: [authGuard] }, aiCreativePath);
}
