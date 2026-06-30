import * as AddressService from "../services/address.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await AddressService.getUserAddresses(req.user.id);
    successResponse(res, { addresses });
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const addAddress = async (req, res) => {
  try {
    const address = await AddressService.addAddress(req.user.id, req.body);
    successResponse(res, { address }, "Address added", 201);
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await AddressService.updateAddress(req.params.id, req.user.id, req.body);
    successResponse(res, { address }, "Address updated");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await AddressService.deleteAddress(req.params.id, req.user.id);
    successResponse(res, {}, "Address deleted");
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};
