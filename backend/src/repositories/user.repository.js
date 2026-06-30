import db from "../config/db.js";

export const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT u.*, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?",
    [email]
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const [rows] = await db.query(
    "SELECT u.*, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?",
    [id]
  );
  return rows[0] || null;
};

export const createUser = async ({ first_name, last_name, email, password, phone, role_id = 2 }) => {
  const [result] = await db.query(
    "INSERT INTO users (first_name,last_name,email,password,phone,role_id) VALUES (?,?,?,?,?,?)",
    [first_name, last_name, email, password, phone, role_id]
  );
  return result.insertId;
};

export const updateUser = async (id, fields) => {
  const keys = Object.keys(fields).map((k) => `${k}=?`).join(",");
  const vals = [...Object.values(fields), id];
  await db.query(`UPDATE users SET ${keys} WHERE id=?`, vals);
};

export const getAllUsers = async ({ limit, offset, search }) => {
  let sql = "SELECT u.id,u.first_name,u.last_name,u.email,u.phone,u.avatar,u.is_active,r.name AS role,u.created_at FROM users u JOIN roles r ON u.role_id=r.id";
  const params = [];
  if (search) { sql += " WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?"; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  sql += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const [rows] = await db.query(sql, params);
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM users");
  return { rows, total };
};

export const deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id=?", [id]);
};

export const findByResetToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE reset_token=? AND reset_token_expiry > NOW()",
    [token]
  );
  return rows[0] || null;
};
