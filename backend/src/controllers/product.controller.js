import * as ProductService from "../services/product.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.util.js";

export const getProducts = async (req, res) => {
  try {
    const { products, pagination } = await ProductService.getProducts(req.query);
    paginatedResponse(res, products, pagination);
  } catch (err) {
    console.error("[getProducts]", err);
    errorResponse(res, err.message, 500);
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await ProductService.getProductBySlug(req.params.slug);
    successResponse(res, { product });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    successResponse(res, { product });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const createProduct = async (req, res) => {
  req.body.is_active = 1;
req.body.is_featured = req.body.is_featured ? 1 : 0;
  try {
    const product = await ProductService.createProduct(req.body, req.files);
    successResponse(res, { product }, "Product created", 201);
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body, req.files);
    successResponse(res, { product }, "Product updated");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    successResponse(res, {}, "Product deleted");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};
