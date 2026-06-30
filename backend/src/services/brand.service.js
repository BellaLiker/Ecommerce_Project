import * as BrandRepo from "../repositories/brand.repository.js";
import slugify from "../utils/slugify.util.js";
import { getImageUrl } from "../config/multer.js";

export const getAll = (activeOnly) => BrandRepo.findAll(activeOnly);

export const getById = async (id) => {
  const brand = await BrandRepo.findById(id);
  if (!brand) throw Object.assign(new Error("Brand not found"), { statusCode: 404 });
  return brand;
};

export const create = async (data, file) => {
  data.slug = data.slug || slugify(data.name);
  if (file) data.logo = getImageUrl("products", file.filename);
  const id = await BrandRepo.create(data);
  return BrandRepo.findById(id);
};

export const update = async (id, data, file) => {
  await getById(id);
  if (data.name && !data.slug) data.slug = slugify(data.name);
  if (file) data.logo = getImageUrl("products", file.filename);
  await BrandRepo.update(id, data);
  return BrandRepo.findById(id);
};

export const remove = async (id) => {
  await getById(id);
  await BrandRepo.remove(id);
};
