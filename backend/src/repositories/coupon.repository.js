import db from "../config/db.js";

export const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM coupons ORDER BY created_at DESC");
  return rows;
};

export const findByCode = async (code) => {
  const [rows] = await db.query(
    "SELECT * FROM coupons WHERE code=? AND is_active=1 AND (expires_at IS NULL OR expires_at > NOW())",
    [code]
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM coupons WHERE id=?", [id]);
  return rows[0] || null;
};

export const create = async (data) => {
  const [r] = await db.query(
    "INSERT INTO coupons (code,type,value,min_order_amount,max_discount,usage_limit,starts_at,expires_at) VALUES (?,?,?,?,?,?,?,?)",
    [data.code, data.type, data.value, data.min_order_amount || 0, data.max_discount || null, data.usage_limit || null, data.starts_at || null, data.expires_at || null]
  );
  return r.insertId;
};

export const update = async (id, data) => {
  const keys = Object.keys(data).map((k) => `${k}=?`).join(",");
  await db.query(`UPDATE coupons SET ${keys} WHERE id=?`, [...Object.values(data), id]);
};

export const remove = async (id) => {
  await db.query("DELETE FROM coupons WHERE id=?", [id]);
};

export const incrementUsed = async (id) => {
  await db.query("UPDATE coupons SET used_count=used_count+1 WHERE id=?", [id]);
};

export const hasUserUsed = async (userId, couponId) => {
  const [rows] = await db.query(
    "SELECT id FROM coupon_usage WHERE user_id=? AND coupon_id=?",
    [userId, couponId]
  );
  return !!rows[0];
};

export const recordUsage = async (couponId, userId, orderId) => {
  await db.query(
    "INSERT INTO coupon_usage (coupon_id,user_id,order_id) VALUES (?,?,?)",
    [couponId, userId, orderId]
  );
};
