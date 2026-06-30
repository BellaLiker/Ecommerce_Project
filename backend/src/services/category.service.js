import * as CategoryRepo from "../repositories/category.repository.js";
import slugify from "../utils/slugify.util.js";
import { getImageUrl } from "../config/multer.js";

export const getAll = (activeOnly) => CategoryRepo.findAll(activeOnly);

export const getById = async (id) => {
  const cat = await CategoryRepo.findById(id);
  if (!cat) throw Object.assign(new Error("Category not found"), { statusCode: 404 });
  return cat;
};

export const create = async (data, file) => {
  data.slug = data.slug || slugify(data.name);
  if (file) data.image = getImageUrl("products", file.filename);
  const id = await CategoryRepo.create(data);
  return CategoryRepo.findById(id);
};

export const update = async (id, data, file) => {
  await getById(id);
  if (data.name && !data.slug) data.slug = slugify(data.name);
  if (file) data.image = getImageUrl("products", file.filename);
  await CategoryRepo.update(id, data);
  return CategoryRepo.findById(id);
};

export const remove = async (id) => {
  await getById(id);
  await CategoryRepo.remove(id);
};
