import api from "./axios.js";
import { ENDPOINTS } from "../constants/api.js";
// Products
export const getProducts = (params) =>
  api.get(ENDPOINTS.PRODUCTS, { params });

export const getProductById = (id) =>
  api.get(`${ENDPOINTS.PRODUCTS}/admin/${id}`);

export const createProduct = (data) =>
  api.post(ENDPOINTS.PRODUCTS, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (id, data) =>
  api.put(`${ENDPOINTS.PRODUCTS}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id) =>
  api.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
// Categories
export const getCategories   = (params) => api.get(ENDPOINTS.CATEGORIES, { params });
export const getCategoryById = (id)     => api.get(`${ENDPOINTS.CATEGORIES}/${id}`);
export const createCategory  = (data)   => api.post(ENDPOINTS.CATEGORIES, data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateCategory  = (id, data) => api.put(`${ENDPOINTS.CATEGORIES}/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteCategory  = (id)     => api.delete(`${ENDPOINTS.CATEGORIES}/${id}`);

// Brands
export const getBrands   = (params) => api.get(ENDPOINTS.BRANDS, { params });
export const getBrandById = (id)    => api.get(`${ENDPOINTS.BRANDS}/${id}`);
export const createBrand = (data)   => api.post(ENDPOINTS.BRANDS, data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateBrand = (id, data) => api.put(`${ENDPOINTS.BRANDS}/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteBrand = (id)     => api.delete(`${ENDPOINTS.BRANDS}/${id}`);

// Cart
export const getCart      = ()              => api.get(ENDPOINTS.CART);
export const addToCart    = (data)          => api.post(ENDPOINTS.CART, data);
export const updateCart   = (productId, data) => api.put(`${ENDPOINTS.CART}/${productId}`, data);
export const removeFromCart = (productId)  => api.delete(`${ENDPOINTS.CART}/${productId}`);
export const clearCart    = ()             => api.delete(`${ENDPOINTS.CART}/clear`);

// Wishlist
export const getWishlist     = ()          => api.get(ENDPOINTS.WISHLIST);
export const toggleWishlist  = (productId) => api.post(`${ENDPOINTS.WISHLIST}/${productId}`);
export const removeWishlist  = (productId) => api.delete(`${ENDPOINTS.WISHLIST}/${productId}`);

// Orders
export const placeOrder     = (data)   => api.post(ENDPOINTS.ORDERS, data);
export const getMyOrders    = (params) => api.get(ENDPOINTS.MY_ORDERS, { params });
export const getMyOrderById = (id)     => api.get(`${ENDPOINTS.MY_ORDERS}/${id}`);
export const cancelOrder    = (id)     => api.patch(`${ENDPOINTS.MY_ORDERS}/${id}/cancel`);
export const getAllOrders    = (params) => api.get(ENDPOINTS.ORDERS, { params });
export const getOrderById   = (id)     => api.get(`${ENDPOINTS.ORDERS}/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`${ENDPOINTS.ORDERS}/${id}/status`, { status });

// Reviews
export const getProductReviews = (productId, params) => api.get(`${ENDPOINTS.REVIEWS}/product/${productId}`, { params });
export const createReview      = (data)   => api.post(ENDPOINTS.REVIEWS, data);
export const getAllReviews      = (params) => api.get(ENDPOINTS.REVIEWS, { params });
export const updateReviewApproval = (id, is_approved) => api.patch(`${ENDPOINTS.REVIEWS}/${id}/approval`, { is_approved });
export const deleteReview      = (id)     => api.delete(`${ENDPOINTS.REVIEWS}/${id}`);

// Coupons
export const validateCoupon = (data)   => api.post(`${ENDPOINTS.COUPONS}/validate`, data);
export const getCoupons     = ()       => api.get(ENDPOINTS.COUPONS);
export const createCoupon   = (data)   => api.post(ENDPOINTS.COUPONS, data);
export const updateCoupon   = (id, data) => api.put(`${ENDPOINTS.COUPONS}/${id}`, data);
export const deleteCoupon   = (id)     => api.delete(`${ENDPOINTS.COUPONS}/${id}`);

// Addresses
export const getAddresses   = ()       => api.get(ENDPOINTS.ADDRESSES);
export const addAddress     = (data)   => api.post(ENDPOINTS.ADDRESSES, data);
export const updateAddress  = (id, data) => api.put(`${ENDPOINTS.ADDRESSES}/${id}`, data);
export const deleteAddress  = (id)     => api.delete(`${ENDPOINTS.ADDRESSES}/${id}`);

// Notifications
export const getNotifications = (params) => api.get(ENDPOINTS.NOTIFICATIONS, { params });
export const markRead         = (id)     => api.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`);
export const markAllRead      = ()       => api.patch(`${ENDPOINTS.NOTIFICATIONS}/read-all`);

// Reports
export const getDashboardStats = ()       => api.get(ENDPOINTS.REPORTS.DASHBOARD);
export const getSalesChart     = (days)   => api.get(ENDPOINTS.REPORTS.SALES_CHART, { params: { days } });

// Settings
export const getSettings    = ()       => api.get(ENDPOINTS.SETTINGS);
export const updateSettings = (data)   => api.put(ENDPOINTS.SETTINGS, data);

// Users (admin)
export const getAllUsers      = (params) => api.get(ENDPOINTS.USERS, { params });
export const getUserById      = (id)     => api.get(`${ENDPOINTS.USERS}/${id}`);
export const toggleUserStatus = (id)     => api.patch(`${ENDPOINTS.USERS}/${id}/toggle-status`);
export const deleteUser       = (id)     => api.delete(`${ENDPOINTS.USERS}/${id}`);

// Profile
export const getProfile    = ()       => api.get(ENDPOINTS.PROFILE);
export const updateProfile = (data)   => api.put(ENDPOINTS.PROFILE, data, { headers: { "Content-Type": "multipart/form-data" } });
