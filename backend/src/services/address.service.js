import * as AddressRepo from "../repositories/address.repository.js";

export const getUserAddresses = (userId) => AddressRepo.findByUser(userId);

export const addAddress = async (userId, data) => {
  const id = await AddressRepo.create({ ...data, user_id: userId });
  return AddressRepo.findById(id);
};

export const updateAddress = async (id, userId, data) => {
  await AddressRepo.update(id, userId, data);
  return AddressRepo.findById(id);
};

export const deleteAddress = (id, userId) => AddressRepo.remove(id, userId);
