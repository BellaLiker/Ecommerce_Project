import db from "../config/db.js";

export const createOrder = async (orderData) => {
  const { user_id, order_number, payment_method, subtotal, discount, shipping_fee, total, coupon_id, shipping_address, notes } = orderData;
  const [r] = await db.query(
    "INSERT INTO orders (user_id,order_number,payment_method,subtotal,discount,shipping_fee,total,coupon_id,shipping_address,notes) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [user_id, order_number, payment_method, subtotal, discount, shipping_fee, total, coupon_id || null, JSON.stringify(shipping_address), notes || null]
  );
  return r.insertId;
};

export const createOrderItems = async (orderId, items) => {
  const vals = items.map((i) => [orderId, i.product_id, i.name, i.thumbnail, i.price, i.quantity, i.subtotal]);
  await db.query("INSERT INTO order_items (order_id,product_id,name,thumbnail,price,quantity,subtotal) VALUES ?", [vals]);
};

export const createPayment = async (orderId, method, amount) => {
  await db.query(
    "INSERT INTO payments (order_id,method,amount) VALUES (?,?,?)",
    [orderId, method, amount]
  );
};

export const findOrderById = async (id) => {
  const [rows] = await db.query(
    `SELECT o.*, CONCAT(u.first_name,' ',u.last_name) AS customer_name, u.email
     FROM orders o JOIN users u ON o.user_id=u.id WHERE o.id=?`,
    [id]
  );
  if (!rows[0]) return null;
  const [items] = await db.query("SELECT * FROM order_items WHERE order_id=?", [id]);
  return { ...rows[0], items };
};

export const findOrdersByUser = async (userId, { limit, offset }) => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [userId, limit, offset]
  );
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM orders WHERE user_id=?", [userId]);
  return { rows, total };
};

export const findAllOrders = async ({ limit, offset, status }) => {
  let sql = `SELECT o.*, CONCAT(u.first_name,' ',u.last_name) AS customer_name FROM orders o JOIN users u ON o.user_id=u.id`;
  const params = [];
  if (status) { sql += " WHERE o.status=?"; params.push(status); }
  sql += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const [rows] = await db.query(sql, params);
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM orders");
  return { rows, total };
};

export const updateOrderStatus = async (id, status) => {
  await db.query("UPDATE orders SET status=? WHERE id=?", [status, id]);
};

export const updatePaymentStatus = async (orderId, status) => {
  await db.query("UPDATE orders SET payment_status=? WHERE id=?", [status, orderId]);
  await db.query("UPDATE payments SET status=?, paid_at=? WHERE order_id=?", [status, status === "paid" ? new Date() : null, orderId]);
};

export const generateOrderNumber = () => {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `ORD-${ts}-${rand}`;
};
