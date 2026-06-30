import * as ReviewService from "../services/review.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.util.js";

export const getProductReviews = async (req, res) => {
  try {
    const { reviews, pagination } = await ReviewService.getProductReviews(req.params.productId, req.query);
    paginatedResponse(res, reviews, pagination);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { reviews, pagination } = await ReviewService.getAllReviews(req.query);
    paginatedResponse(res, reviews, pagination);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const createReview = async (req, res) => {
  try {
    const id = await ReviewService.createReview({ ...req.body, user_id: req.user.id });
    successResponse(res, { id }, "Review submitted", 201);
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const updateApproval = async (req, res) => {
  try {
    await ReviewService.updateApproval(req.params.id, req.body.is_approved);
    successResponse(res, {}, "Review updated");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const deleteReview = async (req, res) => {
  try {
    await ReviewService.deleteReview(req.params.id);
    successResponse(res, {}, "Review deleted");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
