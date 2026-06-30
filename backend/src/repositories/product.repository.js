import db from "../config/db.js";

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name, b.name AS brand_name,
  GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order) AS images
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN brands b ON p.brand_id = b.id
  LEFT JOIN product_images pi ON p.id = pi.product_id
`;
export const findAll = async ({
  limit,
  offset,
  search,
  category_id,
  brand_id,
  min_price,
  max_price,
  sort,
  is_featured,
}) => {
  const where = ["p.is_active = 1"];
  const params = [];

  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    if (trimmedSearch.length >= 4) {
      where.push("MATCH(p.name, p.description) AGAINST(? IN BOOLEAN MODE)");
      params.push(`${trimmedSearch}*`);
    } else {
      where.push("(p.name LIKE ? OR p.description LIKE ?)");
      params.push(`%${trimmedSearch}%`, `%${trimmedSearch}%`);
    }
  }

  if (category_id) {
    where.push("p.category_id = ?");
    params.push(category_id);
  }

  if (brand_id) {
    where.push("p.brand_id = ?");
    params.push(brand_id);
  }

  if (min_price) {
    where.push("p.price >= ?");
    params.push(min_price);
  }

  if (max_price) {
    where.push("p.price <= ?");
    params.push(max_price);
  }

  if (is_featured) {
    where.push("p.is_featured = 1");
  }

  const sortMap = {
    newest: "p.created_at DESC",
    price_asc: "p.price ASC",
    price_desc: "p.price DESC",
    rating: "p.avg_rating DESC",
    popular: "p.sold_count DESC",
  };

  const orderBy = sortMap[sort] || "p.created_at DESC";

  const limitNum = Number(limit);
  const offsetNum = Number(offset);

  const sql = `
    ${BASE_SELECT}
    WHERE ${where.join(" AND ")}
    GROUP BY p.id
    ORDER BY ${orderBy}
    LIMIT ${limitNum}
    OFFSET ${offsetNum}
  `;
  
  const countSql = `
    SELECT COUNT(DISTINCT p.id) AS total
    FROM products p
    WHERE ${where.join(" AND ")}
  `;

  const [rows] = await db.query(sql, params);
  const [[{ total }]] = await db.query(countSql, params);

  return {
    rows: rows.map(parseImages),
    total,
  };
};

export const findById = async (id) => {
  const [rows] = await db.query(`${BASE_SELECT} WHERE p.id = ? GROUP BY p.id`, [id]);
  return rows[0] ? parseImages(rows[0]) : null;
};

export const findBySlug = async (slug) => {
  const [rows] = await db.query(`${BASE_SELECT} WHERE p.slug = ? GROUP BY p.id`, [slug]);
  return rows[0] ? parseImages(rows[0]) : null;
};

export const createProduct = async (data) => {
  const { category_id, brand_id, name, slug, description, short_desc, sku, price, sale_price, stock, thumbnail, is_active, is_featured } = data;
  const [result] = await db.query(
    "INSERT INTO products (category_id,brand_id,name,slug,description,short_desc,sku,price,sale_price,stock,thumbnail,is_active,is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [category_id, brand_id, name, slug, description, short_desc, sku, price, sale_price || null, stock, thumbnail, is_active ?? 1, is_featured ?? 0]
  );
  return result.insertId;
};

export const updateProduct = async (id, data) => {
  const keys = Object.keys(data).map((k) => `${k}=?`).join(",");
  await db.query(`UPDATE products SET ${keys} WHERE id=?`, [...Object.values(data), id]);
};

export const deleteProduct = async (id) => {
  await db.query("DELETE FROM products WHERE id=?", [id]);
};

export const addImages = async (productId, images) => {
  if (!images.length) return;
  const vals = images.map((url, i) => [productId, url, i]);
  await db.query("INSERT INTO product_images (product_id,image_url,sort_order) VALUES ?", [vals]);
};

export const deleteImages = async (productId) => {
  await db.query("DELETE FROM product_images WHERE product_id=?", [productId]);
};

export const updateRating = async (productId) => {
  await db.query(
    "UPDATE products p SET avg_rating=(SELECT AVG(rating) FROM reviews WHERE product_id=p.id AND is_approved=1), review_count=(SELECT COUNT(*) FROM reviews WHERE product_id=p.id AND is_approved=1) WHERE p.id=?",
    [productId]
  );
};

export const incrementSold = async (productId, qty) => {
  await db.query("UPDATE products SET sold_count=sold_count+?, stock=stock-? WHERE id=?", [qty, qty, productId]);
};

const parseImages = (p) => ({
  ...p,
  images: p.images ? p.images.split(",") : [],
});
