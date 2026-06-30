import { Link } from "react-router-dom";
import { Row, Col, Divider } from "antd";
import { APP_NAME } from "../constants/app.js";
import { ROUTES } from "../constants/routes.js";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <Row gutter={[32, 24]}>
          <Col xs={24} sm={12} md={6}>
            <h3 className={styles.brand}>{APP_NAME}</h3>
            <p className={styles.desc}>Your one-stop destination for the best products at the best prices.</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 className={styles.heading}>Shop</h4>
            <ul className={styles.list}>
              <li><Link to={ROUTES.SHOP}>All Products</Link></li>
              <li><Link to={ROUTES.CATEGORIES}>Categories</Link></li>
              <li><Link to={ROUTES.BRANDS}>Brands</Link></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 className={styles.heading}>Account</h4>
            <ul className={styles.list}>
              <li><Link to={ROUTES.LOGIN}>Login</Link></li>
              <li><Link to={ROUTES.REGISTER}>Register</Link></li>
              <li><Link to={ROUTES.USER.ORDERS}>My Orders</Link></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 className={styles.heading}>Support</h4>
            <ul className={styles.list}>
              <li><Link to={ROUTES.ABOUT}>About Us</Link></li>
              <li><Link to={ROUTES.CONTACT}>Contact</Link></li>
              <li><Link to={ROUTES.FAQ}>FAQ</Link></li>
            </ul>
          </Col>
        </Row>
        <Divider style={{ borderColor: "#333" }} />
        <p className={styles.copy}>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
