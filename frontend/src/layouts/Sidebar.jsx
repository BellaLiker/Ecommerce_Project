import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined, AppstoreOutlined, TagsOutlined,
  ShoppingOutlined, UserOutlined, StarOutlined,
  PercentageOutlined, BarChartOutlined, SettingOutlined,
  TeamOutlined, ShopOutlined,
} from "@ant-design/icons";
import { ROUTES } from "../constants/routes.js";
import { APP_NAME } from "../constants/app.js";
import styles from "./Sidebar.module.css";

const items = [
  { key: ROUTES.ADMIN.DASHBOARD,  icon: <DashboardOutlined />, label: <Link to={ROUTES.ADMIN.DASHBOARD}>Dashboard</Link> },
  { key: ROUTES.ADMIN.PRODUCTS,   icon: <ShoppingOutlined />,  label: <Link to={ROUTES.ADMIN.PRODUCTS}>Products</Link> },
  { key: ROUTES.ADMIN.CATEGORIES, icon: <AppstoreOutlined />,  label: <Link to={ROUTES.ADMIN.CATEGORIES}>Categories</Link> },
  { key: ROUTES.ADMIN.BRANDS,     icon: <TagsOutlined />,      label: <Link to={ROUTES.ADMIN.BRANDS}>Brands</Link> },
  { key: ROUTES.ADMIN.ORDERS,     icon: <ShopOutlined />,      label: <Link to={ROUTES.ADMIN.ORDERS}>Orders</Link> },
  { key: ROUTES.ADMIN.CUSTOMERS,  icon: <TeamOutlined />,      label: <Link to={ROUTES.ADMIN.CUSTOMERS}>Customers</Link> },
  { key: ROUTES.ADMIN.USERS,      icon: <UserOutlined />,      label: <Link to={ROUTES.ADMIN.USERS}>Users</Link> },
  { key: ROUTES.ADMIN.REVIEWS,    icon: <StarOutlined />,      label: <Link to={ROUTES.ADMIN.REVIEWS}>Reviews</Link> },
  { key: ROUTES.ADMIN.COUPONS,    icon: <PercentageOutlined />,label: <Link to={ROUTES.ADMIN.COUPONS}>Coupons</Link> },
  { key: ROUTES.ADMIN.REPORTS,    icon: <BarChartOutlined />,  label: <Link to={ROUTES.ADMIN.REPORTS}>Reports</Link> },
  { key: ROUTES.ADMIN.SETTINGS,   icon: <SettingOutlined />,   label: <Link to={ROUTES.ADMIN.SETTINGS}>Settings</Link> },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>{APP_NAME} Admin</div>
      <Menu mode="inline" selectedKeys={[pathname]} items={items} style={{ border: "none" }} />
    </div>
  );
}
