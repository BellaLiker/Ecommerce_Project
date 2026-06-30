import db from "../config/db.js";

export const getWishlist = async (userId) => {
  const [rows] = await db.query(
    `SELECT w.id, p.id AS product_id, p.name, p.slug, p.price, p.sale_price, p.thumbnail, p.avg_rating
     FROM wishlists w JOIN products p ON w.product_id=p.id
     WHERE w.user_id=? ORDER BY w.created_at DESC`,
    [userId]
  );
  return rows;
};

export const addToWishlist = async (userId, productId) => {
  await db.query(
    "INSERT IGNORE INTO wishlists (user_id,product_id) VALUES (?,?)",
    [userId, productId]
  );
};

export const removeFromWishlist = async (userId, productId) => {
  await db.query("DELETE FROM wishlists WHERE user_id=? AND product_id=?", [userId, productId]);
};

export const isInWishlist = async (userId, productId) => {
  const [rows] = await db.query(
    "SELECT id FROM wishlists WHERE user_id=? AND product_id=?",
    [userId, productId]
  );
  return !!rows[0];
};
