import db from "../config/db.js";

export const findByUser = async (userId) => {
  const [rows] = await db.query("SELECT * FROM addresses WHERE user_id=? ORDER BY is_default DESC", [userId]);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM addresses WHERE id=?", [id]);
  return rows[0] || null;
};

export const create = async (data) => {
  if (data.is_default) {
    await db.query("UPDATE addresses SET is_default=0 WHERE user_id=?", [data.user_id]);
  }
  const [r] = await db.query(
    "INSERT INTO addresses (user_id,full_name,phone,address_line1,address_line2,city,state,postal_code,country,is_default) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [data.user_id, data.full_name, data.phone, data.address_line1, data.address_line2 || null, data.city, data.state || null, data.postal_code || null, data.country || "Cambodia", data.is_default || 0]
  );
  return r.insertId;
};

export const update = async (id, userId, data) => {
  if (data.is_default) {
    await db.query("UPDATE addresses SET is_default=0 WHERE user_id=?", [userId]);
  }
  const keys = Object.keys(data).map((k) => `${k}=?`).join(",");
  await db.query(`UPDATE addresses SET ${keys} WHERE id=? AND user_id=?`, [...Object.values(data), id, userId]);
};

export const remove = async (id, userId) => {
  await db.query("DELETE FROM addresses WHERE id=? AND user_id=?", [id, userId]);
};
