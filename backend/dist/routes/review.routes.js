import { postReview } from '../controllers/review.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function reviewRoutes(app) {
    app.post('/', { preHandler: [authGuard] }, postReview);
}
