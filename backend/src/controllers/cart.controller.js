import * as CartService from "../services/cart.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getCart = async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user.id);
    successResponse(res, cart);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const addToCart = async (req, res) => {
  try {
    const cart = await CartService.addToCart(req.user.id, req.body.product_id, req.body.quantity);
    successResponse(res, cart, "Item added to cart");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const updateItem = async (req, res) => {
  try {
    const cart = await CartService.updateCartItem(req.user.id, req.params.productId, req.body.quantity);
    successResponse(res, cart, "Cart updated");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const removeItem = async (req, res) => {
  try {
    const cart = await CartService.removeFromCart(req.user.id, req.params.productId);
    successResponse(res, cart, "Item removed");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const clearCart = async (req, res) => {
  try {
    await CartService.clearCart(req.user.id);
    successResponse(res, {}, "Cart cleared");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
