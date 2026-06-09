import express from 'express';
import {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/categories', getCategoryBreakdown);    
router.get('/trends', getMonthlyTrends);

export default router;