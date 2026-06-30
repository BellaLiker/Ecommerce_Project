import db from "../config/db.js";

export const findAll = async (activeOnly = false) => {
  let sql = "SELECT c.*, p.name AS parent_name FROM categories c LEFT JOIN categories p ON c.parent_id=p.id";
  if (activeOnly) sql += " WHERE c.is_active=1";
  sql += " ORDER BY c.sort_order, c.name";
  const [rows] = await db.query(sql);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM categories WHERE id=?", [id]);
  return rows[0] || null;
};

export const findBySlug = async (slug) => {
  const [rows] = await db.query("SELECT * FROM categories WHERE slug=?", [slug]);
  return rows[0] || null;
};

export const create = async (data) => {
  const [r] = await db.query(
    "INSERT INTO categories (name,slug,description,image,parent_id,is_active,sort_order) VALUES (?,?,?,?,?,?,?)",
    [data.name, data.slug, data.description, data.image, data.parent_id || null, data.is_active ?? 1, data.sort_order || 0]
  );
  return r.insertId;
};

export const update = async (id, data) => {
  const keys = Object.keys(data).map((k) => `${k}=?`).join(",");
  await db.query(`UPDATE categories SET ${keys} WHERE id=?`, [...Object.values(data), id]);
};

export const remove = async (id) => {
  await db.query("DELETE FROM categories WHERE id=?", [id]);
};
