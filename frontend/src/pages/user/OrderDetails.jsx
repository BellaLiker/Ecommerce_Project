import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Tag, Button, Table, Descriptions, Spin, Popconfirm, message, Typography } from "antd";
import { getMyOrderById, cancelOrder } from "../../api/index.js";
import { formatPrice, formatDate } from "../../services/format.service.js";
import { ORDER_STATUS_COLORS } from "../../constants/app.js";
import { getProductImage } from "../../config/image.js";
import { ROUTES } from "../../constants/routes.js";

const { Title } = Typography;

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrderById(id).then(({ data }) => setOrder(data.data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    try {
      await cancelOrder(id);
      message.success("Order cancelled");
      navigate(ROUTES.USER.ORDERS);
    } catch (err) {
      message.error(err.response?.data?.message || "Cannot cancel order");
    }
  };

  if (loading) return <div className="spinner-wrap"><Spin /></div>;
  if (!order) return <div>Order not found</div>;

  const addr = typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address;

  const columns = [
    { title: "Product", dataIndex: "name", render: (n, r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={getProductImage(r.thumbnail)} alt={n} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
          onError={(e) => { e.target.src = "https://via.placeholder.com/48"; }} />
        {n}
      </div>
    )},
    { title: "Price", dataIndex: "price", render: formatPrice },
    { title: "Qty", dataIndex: "quantity" },
    { title: "Subtotal", dataIndex: "subtotal", render: formatPrice },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Order #{order.order_number}</Title>
        <div style={{ display: "flex", gap: 8 }}>
          <Tag color={ORDER_STATUS_COLORS[order.status]} style={{ fontSize: 14, padding: "4px 12px" }}>{order.status?.toUpperCase()}</Tag>
          {["pending", "confirmed"].includes(order.status) && (
            <Popconfirm title="Cancel this order?" onConfirm={handleCancel}>
              <Button danger>Cancel Order</Button>
            </Popconfirm>
          )}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Items" style={{ borderRadius: 10, marginBottom: 16 }}>
            <Table columns={columns} dataSource={order.items} rowKey="id" pagination={false} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Order Summary" style={{ borderRadius: 10, marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Date">{formatDate(order.created_at)}</Descriptions.Item>
              <Descriptions.Item label="Payment">{order.payment_method?.toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="Payment Status"><Tag>{order.payment_status?.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Subtotal">{formatPrice(order.subtotal)}</Descriptions.Item>
              <Descriptions.Item label="Discount">{order.discount > 0 ? `-${formatPrice(order.discount)}` : "-"}</Descriptions.Item>
              <Descriptions.Item label="Shipping">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Free"}</Descriptions.Item>
              <Descriptions.Item label={<strong>Total</strong>}><strong style={{ color: "#1677ff" }}>{formatPrice(order.total)}</strong></Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Shipping Address" style={{ borderRadius: 10 }}>
            <p><strong>{addr?.full_name}</strong></p>
            <p>{addr?.phone}</p>
            <p>{addr?.address_line1}</p>
            {addr?.address_line2 && <p>{addr?.address_line2}</p>}
            <p>{addr?.city}, {addr?.state} {addr?.postal_code}</p>
            <p>{addr?.country}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
