import db from "../config/db.js";

export const findAll = async (activeOnly = false) => {
  let sql = "SELECT * FROM brands";
  if (activeOnly) sql += " WHERE is_active=1";
  sql += " ORDER BY name";
  const [rows] = await db.query(sql);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM brands WHERE id=?", [id]);
  return rows[0] || null;
};

export const create = async (data) => {
  const [r] = await db.query(
    "INSERT INTO brands (name,slug,description,logo,website,is_active) VALUES (?,?,?,?,?,?)",
    [data.name, data.slug, data.description, data.logo, data.website, data.is_active ?? 1]
  );
  return r.insertId;
};

export const update = async (id, data) => {
  const keys = Object.keys(data).map((k) => `${k}=?`).join(",");
  await db.query(`UPDATE brands SET ${keys} WHERE id=?`, [...Object.values(data), id]);
};

export const remove = async (id) => {
  await db.query("DELETE FROM brands WHERE id=?", [id]);
};
