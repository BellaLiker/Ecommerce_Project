import api from "./axios.js";
import { ENDPOINTS } from "../constants/api.js";

export const register  = (data)          => api.post(ENDPOINTS.AUTH.REGISTER, data);
export const login     = (data)          => api.post(ENDPOINTS.AUTH.LOGIN, data);
export const logout    = ()              => api.post(ENDPOINTS.AUTH.LOGOUT);
export const getMe     = ()              => api.get(ENDPOINTS.AUTH.ME);
export const changePassword = (data)    => api.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
