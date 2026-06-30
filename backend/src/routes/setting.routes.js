import { Router } from "express";
import * as SettingController from "../controllers/setting.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();
router.get("/", SettingController.getSettings);
router.put("/", authenticate, authorize("admin"), SettingController.updateSettings);
export default router;
