import * as ReviewRepo from "../repositories/review.repository.js";
import * as ProductRepo from "../repositories/product.repository.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.util.js";

export const getProductReviews = async (productId, query) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await ReviewRepo.findByProduct(productId, { limit, offset });
  return { reviews: rows, pagination: buildPaginationMeta(total, page, limit) };
};

export const getAllReviews = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await ReviewRepo.findAll({ limit, offset });
  return { reviews: rows, pagination: buildPaginationMeta(total, page, limit) };
};

export const createReview = async (data) => {
  const id = await ReviewRepo.create(data);
  await ProductRepo.updateRating(data.product_id);
  return id;
};

export const updateApproval = async (id, is_approved) => {
  await ReviewRepo.updateApproval(id, is_approved);
};

export const deleteReview = async (id) => {
  await ReviewRepo.remove(id);
};
