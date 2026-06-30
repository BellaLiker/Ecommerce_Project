import { verifyAccessToken } from "../utils/token.util.js";
import { errorResponse } from "../utils/response.util.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return errorResponse(res, "Access token required", 401);

  try {
    req.user = verifyAccessToken(authHeader.split(" ")[1]);
    next();
  } catch {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
