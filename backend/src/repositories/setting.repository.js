import db from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM settings ORDER BY group_name, `key`");
  return rows;
};

export const getByKey = async (key) => {
  const [rows] = await db.query("SELECT value FROM settings WHERE `key`=?", [key]);
  return rows[0]?.value ?? null;
};

export const upsert = async (key, value, group = "general") => {
  await db.query(
    "INSERT INTO settings (`key`,value,group_name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE value=?",
    [key, value, group, value]
  );
};

export const upsertMany = async (settings) => {
  for (const { key, value, group } of settings) {
    await upsert(key, value, group);
  }
};
