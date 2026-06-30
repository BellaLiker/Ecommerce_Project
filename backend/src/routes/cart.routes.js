import { Router } from "express";
import * as CartController from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", CartController.getCart);
router.post("/", CartController.addToCart);
router.put("/:productId", CartController.updateItem);
router.delete("/clear", CartController.clearCart);
router.delete("/:productId", CartController.removeItem);

export default router;
