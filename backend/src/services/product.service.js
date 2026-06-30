import * as ProductRepo from "../repositories/product.repository.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.util.js";
import { getImageUrl } from "../config/multer.js";
import slugify from "../utils/slugify.util.js";

export const getProducts = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await ProductRepo.findAll({ limit, offset, ...query });
  return { products: rows, pagination: buildPaginationMeta(total, page, limit) };
};

export const getProductBySlug = async (slug) => {
  const product = await ProductRepo.findBySlug(slug);
  if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  return product;
};

export const getProductById = async (id) => {
  const product = await ProductRepo.findById(id);
  if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  return product;
};

export const createProduct = async (data, files) => {
  data.slug = data.slug || slugify(data.name);
  if (files?.length) data.thumbnail = getImageUrl("products", files[0].filename);
  const id = await ProductRepo.createProduct(data);
  if (files?.length) {
    const urls = files.map((f) => getImageUrl("products", f.filename));
    await ProductRepo.addImages(id, urls);
  }
  return ProductRepo.findById(id);
};

export const updateProduct = async (id, data, files) => {
  const existing = await getProductById(id);
  if (data.name && !data.slug) data.slug = slugify(data.name);
  if (files?.length) {
    data.thumbnail = getImageUrl("products", files[0].filename);
    await ProductRepo.deleteImages(id);
    const urls = files.map((f) => getImageUrl("products", f.filename));
    await ProductRepo.addImages(id, urls);
  }
  await ProductRepo.updateProduct(id, data);
  return ProductRepo.findById(id);
};

export const deleteProduct = async (id) => {
  await getProductById(id);
  await ProductRepo.deleteProduct(id);
};
