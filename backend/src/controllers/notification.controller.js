import * as NotifService from "../services/notification.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.util.js";

export const getNotifications = async (req, res) => {
  try {
    const { notifications, unread, pagination } = await NotifService.getNotifications(req.user.id, req.query);
    paginatedResponse(res, notifications, pagination, "Success");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const markRead = async (req, res) => {
  try {
    await NotifService.markRead(req.params.id, req.user.id);
    successResponse(res, {}, "Marked as read");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const markAllRead = async (req, res) => {
  try {
    await NotifService.markAllRead(req.user.id);
    successResponse(res, {}, "All marked as read");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
