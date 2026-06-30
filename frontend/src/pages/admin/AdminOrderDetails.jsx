import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Tag, Table, Descriptions, Spin, Select, message, Typography } from "antd";
import { getOrderById, updateOrderStatus } from "../../api/index.js";
import { formatPrice, formatDate } from "../../services/format.service.js";
import { ORDER_STATUS_COLORS } from "../../constants/app.js";
import { getProductImage } from "../../config/image.js";

const { Title } = Typography;
const STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled"];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => getOrderById(id).then(({ data }) => setOrder(data.data.order)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, [id]);

  const handleStatus = async (status) => {
    await updateOrderStatus(id, status);
    message.success("Status updated");
    fetch();
  };

  if (loading) return <div className="spinner-wrap"><Spin /></div>;
  if (!order) return <div>Order not found</div>;

  const addr = typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address;

  const columns = [
    { title: "Product", dataIndex: "name", render: (n, r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={getProductImage(r.thumbnail)} alt={n} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }}
          onError={(e) => { e.target.src = "https://via.placeholder.com/44"; }} />
        {n}
      </div>
    )},
    { title: "Price", dataIndex: "price", render: formatPrice },
    { title: "Qty", dataIndex: "quantity" },
    { title: "Subtotal", dataIndex: "subtotal", render: formatPrice },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Order #{order.order_number}</Title>
        <Select value={order.status} onChange={handleStatus} style={{ width: 160 }}
          options={STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} />
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Items" style={{ borderRadius: 10, marginBottom: 16 }}>
            <Table columns={columns} dataSource={order.items} rowKey="id" pagination={false} />
          </Card>
          <Card title="Customer" style={{ borderRadius: 10 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">{order.customer_name}</Descriptions.Item>
              <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Summary" style={{ borderRadius: 10, marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Date">{formatDate(order.created_at)}</Descriptions.Item>
              <Descriptions.Item label="Payment">{order.payment_method?.toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="Pay Status"><Tag>{order.payment_status?.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Subtotal">{formatPrice(order.subtotal)}</Descriptions.Item>
              <Descriptions.Item label="Discount">{order.discount > 0 ? `-${formatPrice(order.discount)}` : "-"}</Descriptions.Item>
              <Descriptions.Item label="Shipping">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Free"}</Descriptions.Item>
              <Descriptions.Item label={<strong>Total</strong>}><strong style={{ color: "#1677ff" }}>{formatPrice(order.total)}</strong></Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Shipping Address" style={{ borderRadius: 10 }}>
            <p><strong>{addr?.full_name}</strong></p>
            <p>{addr?.phone}</p>
            <p>{addr?.address_line1}{addr?.address_line2 ? `, ${addr.address_line2}` : ""}</p>
            <p>{addr?.city}, {addr?.state} {addr?.postal_code}</p>
            <p>{addr?.country}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
