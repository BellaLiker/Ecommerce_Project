import api from "./axios.js";
import { ENDPOINTS } from "../constants/api.js";

export const getProducts   = (params) => api.get(ENDPOINTS.PRODUCTS, { params });
export const getProductBySlug = (slug) => api.get(`${ENDPOINTS.PRODUCTS}/${slug}`);
export const getProductById = (id)    => api.get(`${ENDPOINTS.PRODUCTS}/admin/${id}`);
export const createProduct = (data)   => api.post(ENDPOINTS.PRODUCTS, data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProduct = (id, data) => api.put(`${ENDPOINTS.PRODUCTS}/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteProduct = (id)     => api.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
