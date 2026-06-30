import * as CartRepo from "../repositories/cart.repository.js";
import * as ProductRepo from "../repositories/product.repository.js";

export const getCart = async (userId) => {
  const items = await CartRepo.getCartWithItems(userId);
  const total = items.reduce((sum, i) => sum + (i.sale_price || i.price) * i.quantity, 0);
  return { items, total: parseFloat(total.toFixed(2)) };
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await ProductRepo.findById(productId);
  if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  if (product.stock < quantity) throw Object.assign(new Error("Insufficient stock"), { statusCode: 400 });
  const cartId = await CartRepo.getOrCreateCart(userId);
  await CartRepo.addItem(cartId, productId, quantity);
  return getCart(userId);
};

export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) throw Object.assign(new Error("Quantity must be at least 1"), { statusCode: 400 });
  const cartId = await CartRepo.getOrCreateCart(userId);
  await CartRepo.updateItem(cartId, productId, quantity);
  return getCart(userId);
};

export const removeFromCart = async (userId, productId) => {
  const cartId = await CartRepo.getOrCreateCart(userId);
  await CartRepo.removeItem(cartId, productId);
  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cartId = await CartRepo.getOrCreateCart(userId);
  await CartRepo.clearCart(cartId);
};
