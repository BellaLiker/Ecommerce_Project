import * as UserRepo from "../repositories/user.repository.js";
import { getImageUrl } from "../config/multer.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.util.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.util.js";

export const getProfile = async (req, res) => {
  try {
    const user = await UserRepo.findById(req.user.id);
    const { password, reset_token, reset_token_expiry, ...safe } = user;
    successResponse(res, { user: safe });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const updates = { first_name, last_name, phone };
    if (req.file) updates.avatar = getImageUrl("users", req.file.filename);
    await UserRepo.updateUser(req.user.id, updates);
    const user = await UserRepo.findById(req.user.id);
    const { password, reset_token, reset_token_expiry, ...safe } = user;
    successResponse(res, { user: safe }, "Profile updated");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { rows, total } = await UserRepo.getAllUsers({ limit, offset, search: req.query.search });
    paginatedResponse(res, rows, buildPaginationMeta(total, page, limit));
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserRepo.findById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    const { password, reset_token, reset_token_expiry, ...safe } = user;
    successResponse(res, { user: safe });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await UserRepo.findById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    await UserRepo.updateUser(req.params.id, { is_active: user.is_active ? 0 : 1 });
    successResponse(res, {}, `User ${user.is_active ? "deactivated" : "activated"}`);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserRepo.deleteUser(req.params.id);
    successResponse(res, {}, "User deleted");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
