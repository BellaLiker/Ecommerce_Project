import { Router } from "express";
import * as ReviewController from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/product/:productId", ReviewController.getProductReviews);
router.post("/", authenticate, ReviewController.createReview);
router.get("/", authenticate, authorize("admin"), ReviewController.getAllReviews);
router.patch("/:id/approval", authenticate, authorize("admin"), ReviewController.updateApproval);
router.delete("/:id", authenticate, authorize("admin"), ReviewController.deleteReview);

export default router;
