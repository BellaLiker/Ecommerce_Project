import * as OrderRepo from "../repositories/order.repository.js";
import * as ProductRepo from "../repositories/product.repository.js";
import * as CartRepo from "../repositories/cart.repository.js";
import * as CouponRepo from "../repositories/coupon.repository.js";
import * as NotifRepo from "../repositories/notification.repository.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.util.js";

export const placeOrder = async (userId, { address_id, shipping_address, payment_method, coupon_code, notes }) => {
  const cartId = await CartRepo.getOrCreateCart(userId);
  const items = await CartRepo.getCartWithItems(userId);
  if (!items.length) throw Object.assign(new Error("Cart is empty"), { statusCode: 400 });

  for (const item of items) {
    if (item.stock < item.quantity)
      throw Object.assign(new Error(`Insufficient stock for ${item.name}`), { statusCode: 400 });
  }

  let subtotal = items.reduce((s, i) => s + (i.sale_price || i.price) * i.quantity, 0);
  let discount = 0;
  let coupon = null;

  if (coupon_code) {
    coupon = await CouponRepo.findByCode(coupon_code);
    if (!coupon) throw Object.assign(new Error("Invalid or expired coupon"), { statusCode: 400 });
    if (subtotal < coupon.min_order_amount) throw Object.assign(new Error(`Minimum order amount is $${coupon.min_order_amount}`), { statusCode: 400 });
    const used = await CouponRepo.hasUserUsed(userId, coupon.id);
    if (used) throw Object.assign(new Error("Coupon already used"), { statusCode: 400 });
    discount = coupon.type === "percentage" ? subtotal * (coupon.value / 100) : coupon.value;
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
  }

  const shipping_fee = subtotal - discount >= 100 ? 0 : 5;
  const total = Math.max(0, subtotal - discount + shipping_fee);
  const order_number = OrderRepo.generateOrderNumber();

  const orderId = await OrderRepo.createOrder({
    user_id: userId, order_number, payment_method,
    subtotal, discount, shipping_fee, total,
    coupon_id: coupon?.id, shipping_address, notes,
  });

  const orderItems = items.map((i) => ({
    product_id: i.product_id, name: i.name, thumbnail: i.thumbnail,
    price: i.sale_price || i.price, quantity: i.quantity,
    subtotal: (i.sale_price || i.price) * i.quantity,
  }));

  await OrderRepo.createOrderItems(orderId, orderItems);
  await OrderRepo.createPayment(orderId, payment_method, total);

  for (const item of items) {
    await ProductRepo.incrementSold(item.product_id, item.quantity);
  }

  if (coupon) {
    await CouponRepo.incrementUsed(coupon.id);
    await CouponRepo.recordUsage(coupon.id, userId, orderId);
  }

  await CartRepo.clearCart(cartId);
  await NotifRepo.create(userId, "Order Placed", `Your order ${order_number} has been placed successfully!`, "order", `/orders/${orderId}`);

  return OrderRepo.findOrderById(orderId);
};

export const getUserOrders = async (userId, query) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await OrderRepo.findOrdersByUser(userId, { limit, offset });
  return { orders: rows, pagination: buildPaginationMeta(total, page, limit) };
};

export const getOrderById = async (id, userId, role) => {
  const order = await OrderRepo.findOrderById(id);
  if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  if (role !== "admin" && order.user_id !== userId)
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  return order;
};

export const cancelOrder = async (id, userId) => {
  const order = await getOrderById(id, userId, "user");
  if (!["pending", "confirmed"].includes(order.status))
    throw Object.assign(new Error("Order cannot be cancelled"), { statusCode: 400 });
  await OrderRepo.updateOrderStatus(id, "cancelled");
};

export const updateStatus = async (id, status) => {
  await OrderRepo.updateOrderStatus(id, status);
  return OrderRepo.findOrderById(id);
};

export const getAllOrders = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await OrderRepo.findAllOrders({ limit, offset, status: query.status });
  return { orders: rows, pagination: buildPaginationMeta(total, page, limit) };
};
