import { Table, Button, InputNumber, Empty, Card, Divider, Typography, Space } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { formatPrice } from "../../services/format.service.js";
import { getProductImage } from "../../config/image.js";
import { ROUTES } from "../../constants/routes.js";

const { Title, Text } = Typography;

export default function Cart() {
  const { cart, update, remove } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return (
    <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: 16 }}>
      <Empty description="Please login to view your cart" />
      <Button type="primary" onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
    </div>
  );

  if (!cart.items?.length) return (
    <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: 16 }}>
      <Empty description="Your cart is empty" />
      <Link to={ROUTES.SHOP}><Button type="primary" icon={<ShoppingOutlined />}>Continue Shopping</Button></Link>
    </div>
  );

  const columns = [
    { title: "Product", dataIndex: "name", render: (name, r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={getProductImage(r.thumbnail)} alt={name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
          onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }} />
        <Link to={`/product/${r.slug}`} style={{ fontWeight: 500 }}>{name}</Link>
      </div>
    )},
    { title: "Price", dataIndex: "sale_price", render: (sp, r) => formatPrice(sp || r.price), width: 100 },
    { title: "Qty", dataIndex: "quantity", width: 130, render: (qty, r) => (
      <InputNumber min={1} max={r.stock} value={qty} onChange={(v) => update(r.product_id, v)} />
    )},
    { title: "Subtotal", render: (_, r) => <strong>{formatPrice((r.sale_price || r.price) * r.quantity)}</strong>, width: 110 },
    { title: "", render: (_, r) => <Button danger icon={<DeleteOutlined />} onClick={() => remove(r.product_id)} />, width: 60 },
  ];

  return (
    <div className="container page-section">
      <Title level={3}>Shopping Cart ({cart.items.length} items)</Title>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <Table columns={columns} dataSource={cart.items} rowKey="product_id" pagination={false} />
        </div>
        <Card style={{ width: 300, height: "fit-content", borderRadius: 10 }}>
          <Title level={4}>Order Summary</Title>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Text>Subtotal</Text><Text>{formatPrice(cart.total)}</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Text>Shipping</Text><Text style={{ color: "#52c41a" }}>{cart.total >= 100 ? "Free" : "$5.00"}</Text>
          </div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Total</Title>
            <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
              {formatPrice(cart.total >= 100 ? cart.total : cart.total + 5)}
            </Title>
          </div>
          <Button type="primary" block size="large" onClick={() => navigate(ROUTES.CHECKOUT)}>Proceed to Checkout</Button>
          <Link to={ROUTES.SHOP}><Button block style={{ marginTop: 8 }}>Continue Shopping</Button></Link>
        </Card>
      </div>
    </div>
  );
}
