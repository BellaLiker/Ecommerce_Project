import { Router } from "express";
import * as AddressController from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);
router.get("/", AddressController.getAddresses);
router.post("/", AddressController.addAddress);
router.put("/:id", AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);
export default router;
