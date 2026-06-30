import { Router } from "express";
import * as CategoryController from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { productImagesUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", authenticate, authorize("admin"), productImagesUpload, CategoryController.create);
router.put("/:id", authenticate, authorize("admin"), productImagesUpload, CategoryController.update);
router.delete("/:id", authenticate, authorize("admin"), CategoryController.remove);

export default router;
