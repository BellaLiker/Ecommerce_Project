import { Router } from "express";
import * as BrandController from "../controllers/brand.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { productImagesUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", BrandController.getAll);
router.get("/:id", BrandController.getById);
router.post("/", authenticate, authorize("admin"), productImagesUpload, BrandController.create);
router.put("/:id", authenticate, authorize("admin"), productImagesUpload, BrandController.update);
router.delete("/:id", authenticate, authorize("admin"), BrandController.remove);

export default router;
