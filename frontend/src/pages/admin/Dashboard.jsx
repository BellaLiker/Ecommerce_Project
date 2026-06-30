import { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, Table, Tag } from "antd";
import { DollarOutlined, ShoppingOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { getDashboardStats } from "../../api/index.js";
import StatsCard from "../../components/admin/StatsCard.jsx";
import SalesChart from "../../components/admin/SalesChart.jsx";
import { formatPrice, formatDate } from "../../services/format.service.js";
import { ORDER_STATUS_COLORS } from "../../constants/app.js";

const { Title } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><Spin size="large" /></div>;

  const cards = [
    { title: "Total Revenue", value: formatPrice(stats?.total_revenue || 0), icon: <DollarOutlined />, color: "#52c41a" },
    { title: "Total Orders",  value: stats?.total_orders || 0,               icon: <ShoppingOutlined />, color: "#1677ff" },
    { title: "Customers",     value: stats?.total_customers || 0,            icon: <UserOutlined />,     color: "#722ed1" },
    { title: "Products",      value: stats?.total_products || 0,             icon: <AppstoreOutlined />, color: "#fa8c16" },
  ];

  const orderCols = [
    { title: "Order #", dataIndex: "order_number" },
    { title: "Customer", dataIndex: "customer" },
    { title: "Total", dataIndex: "total", render: formatPrice },
    { title: "Status", dataIndex: "status", render: (v) => <Tag color={ORDER_STATUS_COLORS[v]}>{v?.toUpperCase()}</Tag> },
    { title: "Date", dataIndex: "created_at", render: formatDate },
  ];

  const productCols = [
    { title: "Product", dataIndex: "name", ellipsis: true },
    { title: "Price", dataIndex: "price", render: formatPrice },
    { title: "Sold", dataIndex: "sold_count" },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        {cards.map((c) => <Col key={c.title} xs={24} sm={12} lg={6}><StatsCard {...c} /></Col>)}
      </Row>

      <div style={{ marginTop: 24 }}>
        <SalesChart />
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <div style={{ background: "#fff", borderRadius: 10, padding: 16 }}>
            <Title level={5}>Recent Orders</Title>
            <Table columns={orderCols} dataSource={stats?.recent_orders || []} rowKey="id" pagination={false} size="small" />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div style={{ background: "#fff", borderRadius: 10, padding: 16 }}>
            <Title level={5}>Best Selling Products</Title>
            <Table columns={productCols} dataSource={stats?.best_sellers || []} rowKey="id" pagination={false} size="small" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
