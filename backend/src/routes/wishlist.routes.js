import { Router } from "express";
import * as WishlistController from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", WishlistController.getWishlist);
router.post("/:productId", WishlistController.toggle);
router.delete("/:productId", WishlistController.remove);

export default router;
