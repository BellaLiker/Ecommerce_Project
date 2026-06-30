import * as CouponRepo from "../repositories/coupon.repository.js";

export const getAll = () => CouponRepo.findAll();

export const validateCoupon = async (code, userId, orderAmount) => {
  const coupon = await CouponRepo.findByCode(code);
  if (!coupon) throw Object.assign(new Error("Invalid or expired coupon"), { statusCode: 400 });
  if (orderAmount < coupon.min_order_amount)
    throw Object.assign(new Error(`Minimum order amount is $${coupon.min_order_amount}`), { statusCode: 400 });
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit)
    throw Object.assign(new Error("Coupon usage limit reached"), { statusCode: 400 });
  const used = await CouponRepo.hasUserUsed(userId, coupon.id);
  if (used) throw Object.assign(new Error("You have already used this coupon"), { statusCode: 400 });
  let discount = coupon.type === "percentage" ? orderAmount * (coupon.value / 100) : coupon.value;
  if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
  return { coupon, discount: parseFloat(discount.toFixed(2)) };
};

export const create = async (data) => {
  const id = await CouponRepo.create(data);
  return CouponRepo.findById(id);
};

export const update = async (id, data) => {
  await CouponRepo.update(id, data);
  return CouponRepo.findById(id);
};

export const remove = (id) => CouponRepo.remove(id);
