import db from "../config/db.js";

export const findByProduct = async (productId, { limit, offset }) => {
  const [rows] = await db.query(
    `SELECT r.*, CONCAT(u.first_name,' ',u.last_name) AS user_name, u.avatar
     FROM reviews r JOIN users u ON r.user_id=u.id
     WHERE r.product_id=? AND r.is_approved=1 ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [productId, limit, offset]
  );
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM reviews WHERE product_id=? AND is_approved=1", [productId]);
  return { rows, total };
};

export const findAll = async ({ limit, offset }) => {
  const [rows] = await db.query(
    `SELECT r.*, p.name AS product_name, CONCAT(u.first_name,' ',u.last_name) AS user_name
     FROM reviews r JOIN products p ON r.product_id=p.id JOIN users u ON r.user_id=u.id
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM reviews");
  return { rows, total };
};

export const create = async (data) => {
  const [r] = await db.query(
    "INSERT INTO reviews (user_id,product_id,order_id,rating,title,body) VALUES (?,?,?,?,?,?)",
    [data.user_id, data.product_id, data.order_id || null, data.rating, data.title, data.body]
  );
  return r.insertId;
};

export const updateApproval = async (id, is_approved) => {
  await db.query("UPDATE reviews SET is_approved=? WHERE id=?", [is_approved, id]);
};

export const remove = async (id) => {
  await db.query("DELETE FROM reviews WHERE id=?", [id]);
};
