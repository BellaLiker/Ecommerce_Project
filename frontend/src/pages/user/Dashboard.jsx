import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography, Spin } from "antd";
import { ShoppingOutlined, HeartOutlined, EnvironmentOutlined, BellOutlined } from "@ant-design/icons";
import { getMyOrders } from "../../api/index.js";
import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";

const { Title, Text } = Typography;

export default function UserDashboard() {
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders({ limit: 5 }).then(({ data }) => setOrders(data.data)).finally(() => setLoading(false));
  }, []);

  const stats = [
    { title: "Total Orders", value: orders.length, icon: <ShoppingOutlined />, color: "#1677ff", link: ROUTES.USER.ORDERS },
    { title: "Wishlist Items", value: wishlistItems.length, icon: <HeartOutlined />, color: "#ff4d4f", link: ROUTES.USER.WISHLIST },
  ];

  if (loading) return <div className="spinner-wrap"><Spin /></div>;

  return (
    <div>
      <Title level={3}>Welcome back, {user?.first_name}!</Title>
      <Text type="secondary">Here's what's happening with your account.</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {stats.map((s) => (
          <Col xs={24} sm={12} key={s.title}>
            <Link to={s.link}>
              <Card hoverable style={{ borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Statistic title={s.title} value={s.value} />
                  <div style={{ fontSize: 32, color: s.color }}>{s.icon}</div>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Card title="Recent Orders" style={{ marginTop: 24, borderRadius: 10 }}>
        {orders.length === 0 ? (
          <Text type="secondary">No orders yet. <Link to={ROUTES.SHOP}>Start shopping!</Link></Text>
        ) : (
          orders.slice(0, 5).map((o) => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <Text strong>#{o.order_number}</Text>
                <br /><Text type="secondary" style={{ fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text strong>${parseFloat(o.total).toFixed(2)}</Text>
                <br /><Text type="secondary" style={{ fontSize: 12, textTransform: "capitalize" }}>{o.status}</Text>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
