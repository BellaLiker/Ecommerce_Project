import * as WishlistService from "../services/wishlist.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getWishlist = async (req, res) => {
  try {
    const items = await WishlistService.getWishlist(req.user.id);
    successResponse(res, { items });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const toggle = async (req, res) => {
  try {
    const result = await WishlistService.toggleWishlist(req.user.id, req.params.productId);
    successResponse(res, result, result.added ? "Added to wishlist" : "Removed from wishlist");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const remove = async (req, res) => {
  try {
    await WishlistService.removeFromWishlist(req.user.id, req.params.productId);
    successResponse(res, {}, "Removed from wishlist");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
