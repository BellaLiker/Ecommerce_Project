import * as CouponService from "../services/coupon.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getAll = async (_req, res) => {
  try {
    const coupons = await CouponService.getAll();
    successResponse(res, { coupons });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const validate = async (req, res) => {
  try {
    const result = await CouponService.validateCoupon(req.body.code, req.user.id, req.body.order_amount);
    successResponse(res, result, "Coupon applied");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 400);
  }
};

export const create = async (req, res) => {
  try {
    const coupon = await CouponService.create(req.body);
    successResponse(res, { coupon }, "Coupon created", 201);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const coupon = await CouponService.update(req.params.id, req.body);
    successResponse(res, { coupon }, "Coupon updated");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const remove = async (req, res) => {
  try {
    await CouponService.remove(req.params.id);
    successResponse(res, {}, "Coupon deleted");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
