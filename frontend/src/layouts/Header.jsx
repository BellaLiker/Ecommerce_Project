import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Dropdown, Input, Avatar } from "antd";
import {
  ShoppingCartOutlined, HeartOutlined, UserOutlined,
  SearchOutlined, LogoutOutlined, DashboardOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useState } from "react";
import { ROUTES } from "../constants/routes.js";
import { APP_NAME } from "../constants/app.js";
import { getUserImage } from "../config/image.js";
import CartDrawer from "../components/CartDrawer.jsx";
import styles from "./Header.module.css";

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) navigate(`${ROUTES.SHOP}?search=${encodeURIComponent(search.trim())}`);
  };

  const userMenuItems = [
    { key: "dashboard", label: <Link to={ROUTES.USER.DASHBOARD}>Dashboard</Link>, icon: <DashboardOutlined /> },
    { key: "profile",   label: <Link to={ROUTES.USER.PROFILE}>Profile</Link>,     icon: <UserOutlined /> },
    { key: "orders",    label: <Link to={ROUTES.USER.ORDERS}>My Orders</Link> },
    isAdmin && { key: "admin", label: <Link to={ROUTES.ADMIN.DASHBOARD}>Admin Panel</Link>, icon: <DashboardOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true, onClick: () => { logout(); navigate(ROUTES.LOGIN); } },
  ].filter(Boolean);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to={ROUTES.HOME} className={styles.logo}>{APP_NAME}</Link>

        {/* Search */}
        <div className={styles.searchWrap}>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: "pointer" }} />}
            className={styles.searchInput}
          />
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          <Link to={ROUTES.SHOP} className={styles.navLink}>Shop</Link>
          <Link to={ROUTES.CATEGORIES} className={styles.navLink}>Categories</Link>
          <Link to={ROUTES.BRANDS} className={styles.navLink}>Brands</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {isAuthenticated && (
            <Link to={ROUTES.USER.WISHLIST}>
              <Button type="text" icon={<HeartOutlined />} />
            </Link>
          )}
          <Badge count={itemCount} size="small">
            <Button type="text" icon={<ShoppingCartOutlined />} onClick={openDrawer} />
          </Badge>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                src={user?.avatar ? getUserImage(user.avatar) : null}
                icon={!user?.avatar && <UserOutlined />}
                style={{ cursor: "pointer", background: "#1677ff" }}
              />
            </Dropdown>
          ) : (
            <div className={styles.authBtns}>
              <Button onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
              <Button type="primary" onClick={() => navigate(ROUTES.REGISTER)}>Register</Button>
            </div>
          )}
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
