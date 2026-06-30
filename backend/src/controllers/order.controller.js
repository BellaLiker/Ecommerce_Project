import * as OrderService from "../services/order.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.util.js";

export const placeOrder = async (req, res) => {
  try {
    const order = await OrderService.placeOrder(req.user.id, req.body);
    successResponse(res, { order }, "Order placed successfully", 201);
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { orders, pagination } = await OrderService.getUserOrders(req.user.id, req.query);
    paginatedResponse(res, orders, pagination);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id, req.user.id, req.user.role);
    successResponse(res, { order });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    await OrderService.cancelOrder(req.params.id, req.user.id);
    successResponse(res, {}, "Order cancelled");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { orders, pagination } = await OrderService.getAllOrders(req.query);
    paginatedResponse(res, orders, pagination);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const order = await OrderService.updateStatus(req.params.id, req.body.status);
    successResponse(res, { order }, "Order status updated");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
