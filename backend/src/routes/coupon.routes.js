import { Router } from "express";
import * as CouponController from "../controllers/coupon.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/validate", authenticate, CouponController.validate);
router.get("/", authenticate, authorize("admin"), CouponController.getAll);
router.post("/", authenticate, authorize("admin"), CouponController.create);
router.put("/:id", authenticate, authorize("admin"), CouponController.update);
router.delete("/:id", authenticate, authorize("admin"), CouponController.remove);

export default router;
