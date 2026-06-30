const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8080/uploads/ecommerce_web/";

export const getProductImage = (filename) =>
  filename?.startsWith("http") ? filename : `${IMAGE_BASE_URL}products/${filename}`;

export const getUserImage = (filename) =>
  filename?.startsWith("http") ? filename : `${IMAGE_BASE_URL}users/${filename}`;

export const getImageUrl = (path) =>
  path?.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default IMAGE_BASE_URL;
