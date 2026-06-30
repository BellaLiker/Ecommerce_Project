export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
  AUTH: {
    REGISTER:        "/auth/register",
    LOGIN:           "/auth/login",
    LOGOUT:          "/auth/logout",
    REFRESH:         "/auth/refresh",
    ME:              "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USERS:         "/users",
  PROFILE:       "/users/profile",
  PRODUCTS:      "/products",
  CATEGORIES:    "/categories",
  BRANDS:        "/brands",
  CART:          "/cart",
  WISHLIST:      "/wishlist",
  ORDERS:        "/orders",
  MY_ORDERS:     "/orders/my-orders",
  REVIEWS:       "/reviews",
  COUPONS:       "/coupons",
  ADDRESSES:     "/addresses",
  NOTIFICATIONS: "/notifications",
  REPORTS: {
    DASHBOARD:    "/reports/dashboard",
    SALES_CHART:  "/reports/sales-chart",
  },
  SETTINGS:      "/settings",
};
