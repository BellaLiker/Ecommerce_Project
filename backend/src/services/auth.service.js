import * as UserRepo from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.util.js";

export const register = async ({ first_name, last_name, email, password, phone }) => {
  const existing = await UserRepo.findByEmail(email);
  if (existing) throw Object.assign(new Error("Email already registered"), { statusCode: 409 });
  const hashed = await hashPassword(password);
  const id = await UserRepo.createUser({ first_name, last_name, email, password: hashed, phone });
  return UserRepo.findById(id);
};

export const login = async (email, password) => {
  const user = await UserRepo.findByEmail(email);
  if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  if (!user.is_active) throw Object.assign(new Error("Account is deactivated"), { statusCode: 403 });
  const match = await comparePassword(password, user.password);
  if (!match) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  const payload = { id: user.id, role: user.role };
  return {
    access_token: signAccessToken(payload),
    refresh_token: signRefreshToken(payload),
    user: sanitize(user),
  };
};

export const refreshToken = (token) => {
  const payload = verifyRefreshToken(token);
  return { access_token: signAccessToken({ id: payload.id, role: payload.role }) };
};

export const getProfile = async (id) => {
  const user = await UserRepo.findById(id);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return sanitize(user);
};

export const changePassword = async (id, oldPassword, newPassword) => {
  const user = await UserRepo.findById(id);
  const match = await comparePassword(oldPassword, user.password);
  if (!match) throw Object.assign(new Error("Current password is incorrect"), { statusCode: 400 });
  await UserRepo.updateUser(id, { password: await hashPassword(newPassword) });
};

const sanitize = ({ password, reset_token, reset_token_expiry, ...u }) => u;
