import db from "../config/db.js";

export const getOrCreateCart = async (userId) => {
  const [rows] = await db.query("SELECT id FROM carts WHERE user_id=?", [userId]);
  if (rows[0]) return rows[0].id;
  const [r] = await db.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  return r.insertId;
};

export const getCartWithItems = async (userId) => {
  const [rows] = await db.query(
    `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.slug, p.price, p.sale_price, p.thumbnail, p.stock
     FROM carts c
     JOIN cart_items ci ON c.id=ci.cart_id
     JOIN products p ON ci.product_id=p.id
     WHERE c.user_id=?`,
    [userId]
  );
  return rows;
};

export const addItem = async (cartId, productId, quantity) => {
  await db.query(
    "INSERT INTO cart_items (cart_id,product_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=quantity+?",
    [cartId, productId, quantity, quantity]
  );
};

export const updateItem = async (cartId, productId, quantity) => {
  await db.query(
    "UPDATE cart_items SET quantity=? WHERE cart_id=? AND product_id=?",
    [quantity, cartId, productId]
  );
};

export const removeItem = async (cartId, productId) => {
  await db.query("DELETE FROM cart_items WHERE cart_id=? AND product_id=?", [cartId, productId]);
};

export const clearCart = async (cartId) => {
  await db.query("DELETE FROM cart_items WHERE cart_id=?", [cartId]);
};
