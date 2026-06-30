import { uploadProductImages, uploadUserImage } from "../config/multer.js";
import { errorResponse } from "../utils/response.util.js";

const handleMulterError = (err, res) => {
  if (err) return errorResponse(res, err.message, 400);
};

export const productImagesUpload = (req, res, next) => {
  uploadProductImages.array("images", 10)(req, res, (err) => {
    if (err) return handleMulterError(err, res);
    next();
  });
};

export const userImageUpload = (req, res, next) => {
  uploadUserImage.single("avatar")(req, res, (err) => {
    if (err) return handleMulterError(err, res);
    next();
  });
};
