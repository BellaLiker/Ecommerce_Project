import db from "../config/db.js";

export const getDashboardStats = async () => {
  const [[{ total_revenue }]] = await db.query("SELECT COALESCE(SUM(total),0) AS total_revenue FROM orders WHERE payment_status='paid'");
  const [[{ total_orders }]] = await db.query("SELECT COUNT(*) AS total_orders FROM orders");
  const [[{ total_customers }]] = await db.query("SELECT COUNT(*) AS total_customers FROM users WHERE role_id=2");
  const [[{ total_products }]] = await db.query("SELECT COUNT(*) AS total_products FROM products WHERE is_active=1");
  const [recent_orders] = await db.query(
    `SELECT o.id, o.order_number, o.total, o.status, o.created_at, CONCAT(u.first_name,' ',u.last_name) AS customer
     FROM orders o JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC LIMIT 5`
  );
  const [best_sellers] = await db.query(
    "SELECT id,name,sold_count,price,thumbnail FROM products ORDER BY sold_count DESC LIMIT 5"
  );
  return { total_revenue, total_orders, total_customers, total_products, recent_orders, best_sellers };
};

export const getSalesChart = async (days = 7) => {
  const [rows] = await db.query(
    `SELECT DATE(created_at) AS date, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
     FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at) ORDER BY date`,
    [days]
  );
  return rows;
};
