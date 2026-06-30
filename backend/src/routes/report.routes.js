import { Router } from "express";
import * as ReportController from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();
router.use(authenticate, authorize("admin"));
router.get("/dashboard", ReportController.getDashboard);
router.get("/sales-chart", ReportController.getSalesChart);
export default router;
