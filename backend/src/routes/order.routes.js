import { Router } from "express";
import * as OrderController from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);
router.post("/", OrderController.placeOrder);
router.get("/my-orders", OrderController.getMyOrders);
router.get("/my-orders/:id", OrderController.getOrderById);
router.patch("/my-orders/:id/cancel", OrderController.cancelOrder);

// Admin
router.get("/", authorize("admin"), OrderController.getAllOrders);
router.get("/:id", authorize("admin"), OrderController.getOrderById);
router.patch("/:id/status", authorize("admin"), OrderController.updateStatus);

export default router;
