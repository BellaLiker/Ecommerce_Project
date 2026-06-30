import { Router } from "express";
import * as NotifController from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);
router.get("/", NotifController.getNotifications);
router.patch("/read-all", NotifController.markAllRead);
router.patch("/:id/read", NotifController.markRead);
export default router;
