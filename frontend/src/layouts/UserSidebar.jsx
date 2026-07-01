import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined, UserOutlined, LockOutlined,
  ShoppingOutlined, HeartOutlined, EnvironmentOutlined, BellOutlined,
} from "@ant-design/icons";
import { ROUTES } from "../constants/routes.js";
import styles from "./Sidebar.module.css";

const items = [
  { key: ROUTES.USER.DASHBOARD,       icon: <DashboardOutlined />, label: <Link to={ROUTES.USER.DASHBOARD}>Dashboard</Link> },
  { key: ROUTES.USER.PROFILE,         icon: <UserOutlined />,      label: <Link to={ROUTES.USER.PROFILE}>Profile</Link> },
  { key: ROUTES.USER.CHANGE_PASSWORD, icon: <LockOutlined />,      label: <Link to={ROUTES.USER.CHANGE_PASSWORD}>Change Password</Link> },
  { key: ROUTES.USER.ORDERS,          icon: <ShoppingOutlined />,  label: <Link to={ROUTES.USER.ORDERS}>My Orders</Link> },
  { key: ROUTES.USER.WISHLIST,        icon: <HeartOutlined />,     label: <Link to={ROUTES.USER.WISHLIST}>Wishlist</Link> },
  { key: ROUTES.USER.ADDRESSES,       icon: <EnvironmentOutlined />,label: <Link to={ROUTES.USER.ADDRESSES}>Addresses</Link> },
  { key: ROUTES.USER.NOTIFICATIONS,   icon: <BellOutlined />,      label: <Link to={ROUTES.USER.NOTIFICATIONS}>Notifications</Link> },
];

export default function UserSidebar() {
  const { pathname } = useLocation();
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>My Account</div>
      <Menu mode="inline"theme="dark" selectedKeys={[pathname]} items={items} style={{ border: "none" }} />
    </div>
  );
}
