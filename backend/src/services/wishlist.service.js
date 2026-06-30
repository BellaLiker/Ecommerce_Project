import * as WishlistRepo from "../repositories/wishlist.repository.js";

export const getWishlist = (userId) => WishlistRepo.getWishlist(userId);

export const toggleWishlist = async (userId, productId) => {
  const exists = await WishlistRepo.isInWishlist(userId, productId);
  if (exists) {
    await WishlistRepo.removeFromWishlist(userId, productId);
    return { added: false };
  }
  await WishlistRepo.addToWishlist(userId, productId);
  return { added: true };
};

export const removeFromWishlist = (userId, productId) =>
  WishlistRepo.removeFromWishlist(userId, productId);
