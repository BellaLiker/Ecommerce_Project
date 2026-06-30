import * as BrandService from "../services/brand.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true";
    const brands = await BrandService.getAll(activeOnly);
    successResponse(res, { brands });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getById = async (req, res) => {
  try {
    const brand = await BrandService.getById(req.params.id);
    successResponse(res, { brand });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const create = async (req, res) => {
  try {
    const brand = await BrandService.create(req.body, req.file);
    successResponse(res, { brand }, "Brand created", 201);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const brand = await BrandService.update(req.params.id, req.body, req.file);
    successResponse(res, { brand }, "Brand updated");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const remove = async (req, res) => {
  try {
    await BrandService.remove(req.params.id);
    successResponse(res, {}, "Brand deleted");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};
