import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { userImageUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, userImageUpload, UserController.updateProfile);

// Admin only
router.get("/", authenticate, authorize("admin"), UserController.getAllUsers);
router.get("/:id", authenticate, authorize("admin"), UserController.getUserById);
router.patch("/:id/toggle-status", authenticate, authorize("admin"), UserController.toggleUserStatus);
router.delete("/:id", authenticate, authorize("admin"), UserController.deleteUser);

export default router;
