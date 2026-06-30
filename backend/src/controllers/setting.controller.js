import * as SettingRepo from "../repositories/setting.repository.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getSettings = async (_req, res) => {
  try {
    const settings = await SettingRepo.getAll();
    successResponse(res, { settings });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const updateSettings = async (req, res) => {
  try {
    await SettingRepo.upsertMany(req.body.settings);
    successResponse(res, {}, "Settings updated");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
