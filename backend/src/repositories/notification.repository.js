import db from "../config/db.js";

export const findByUser = async (userId, { limit, offset }) => {
  const [rows] = await db.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [userId, limit, offset]
  );
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM notifications WHERE user_id=?", [userId]);
  const [[{ unread }]] = await db.query("SELECT COUNT(*) AS unread FROM notifications WHERE user_id=? AND is_read=0", [userId]);
  return { rows, total, unread };
};

export const create = async (userId, title, message, type = "info", link = null) => {
  await db.query(
    "INSERT INTO notifications (user_id,title,message,type,link) VALUES (?,?,?,?,?)",
    [userId, title, message, type, link]
  );
};

export const markRead = async (id, userId) => {
  await db.query("UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?", [id, userId]);
};

export const markAllRead = async (userId) => {
  await db.query("UPDATE notifications SET is_read=1 WHERE user_id=?", [userId]);
};
