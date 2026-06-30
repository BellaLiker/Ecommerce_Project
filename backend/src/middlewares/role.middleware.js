import { errorResponse } from "../utils/response.util.js";

export const authorize = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return errorResponse(res, "Forbidden: insufficient permissions", 403);
    next();
  };
