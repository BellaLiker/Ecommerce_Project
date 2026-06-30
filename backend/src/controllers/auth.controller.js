import * as AuthService from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    successResponse(res, { user }, "Registration successful", 201);
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const login = async (req, res) => {
  try {
    const data = await AuthService.login(req.body.email, req.body.password);
    res.cookie("refresh_token", data.refresh_token, {
      httpOnly: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    successResponse(res, { access_token: data.access_token, user: data.user }, "Login successful");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const logout = (_req, res) => {
  res.clearCookie("refresh_token");
  successResponse(res, {}, "Logged out");
};

export const refresh = (req, res) => {
  try {
    const token = req.cookies?.refresh_token || req.body.refresh_token;
    if (!token) return errorResponse(res, "Refresh token required", 401);
    const data = AuthService.refreshToken(token);
    successResponse(res, data, "Token refreshed");
  } catch {
    errorResponse(res, "Invalid refresh token", 401);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    successResponse(res, { user });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

export const changePassword = async (req, res) => {
  try {
    await AuthService.changePassword(req.user.id, req.body.old_password, req.body.new_password);
    successResponse(res, {}, "Password changed successfully");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};
