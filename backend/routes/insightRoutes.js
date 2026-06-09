import express from "express";
import insightController from "../controllers/insightController.js";

const router = express.Router();

// GET routes - Retrieve insights and metrics
router.get("/insights/:userId", insightController.getUserInsights);
router.get("/insights/:userId/monthly", insightController.generateMonthlyInsights);
router.get("/insights/:userId/budgets", insightController.generateBudgetAlerts);
router.get("/insights/:userId/tips", insightController.generateTips);

// POST routes - Generate or refresh insights
router.post("/insights/:userId/generate", insightController.getUserInsights);
router.post("/insights/:userId/monthly", insightController.generateMonthlyInsights);
router.post("/insights/:userId/budgets", insightController.generateBudgetAlerts);
router.post("/insights/:userId/tips", insightController.generateTips);

export default router;
