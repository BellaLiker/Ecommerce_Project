import * as CategoryService from "../services/category.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true";
    const categories = await CategoryService.getAll(activeOnly);
    successResponse(res, { categories });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getById = async (req, res) => {
  try {
    const category = await CategoryService.getById(req.params.id);
    successResponse(res, { category });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const create = async (req, res) => {
  try {
    const category = await CategoryService.create(req.body, req.file);
    successResponse(res, { category }, "Category created", 201);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const category = await CategoryService.update(req.params.id, req.body, req.file);
    successResponse(res, { category }, "Category updated");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const remove = async (req, res) => {
  try {
    await CategoryService.remove(req.params.id);
    successResponse(res, {}, "Category deleted");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};
