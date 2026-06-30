import * as ReportRepo from "../repositories/report.repository.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getDashboard = async (_req, res) => {
  try {
    const stats = await ReportRepo.getDashboardStats();
    successResponse(res, stats);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const getSalesChart = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await ReportRepo.getSalesChart(days);
    successResponse(res, { chart: data });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
