import { Router } from "express";
import * as ProductController from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { productImagesUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:slug", ProductController.getProductBySlug);

// Admin only
router.post("/", authenticate, authorize("admin"), productImagesUpload, ProductController.createProduct);
router.put("/:id", authenticate, authorize("admin"), productImagesUpload, ProductController.updateProduct);
router.delete("/:id", authenticate, authorize("admin"), ProductController.deleteProduct);
router.get("/admin/:id", authenticate, authorize("admin"), ProductController.getProductById);

export default router;
