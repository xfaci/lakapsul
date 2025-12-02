import { uploadPortfolio } from '../controllers/portfolio.controller';
import { authGuard } from '../middlewares/authGuard';
export default async function portfolioRoutes(app) {
    app.post('/', { preHandler: [authGuard] }, uploadPortfolio);
}
