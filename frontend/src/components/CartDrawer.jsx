import { Drawer, Button, Empty, Typography } from "antd";
import { DeleteOutlined, ShoppingOutlined, MinusOutlined, PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { formatPrice } from "../services/format.service.js";
import { getProductImage } from "../config/image.js";
import { ROUTES } from "../constants/routes.js";

const { Title, Text } = Typography;

const ACCENT = "#1677ff";
const ACCENT_BG = "#e8f1ff";

export default function CartDrawer() {
  const { cart, update, remove, drawerOpen, closeDrawer } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const goAndClose = (path) => {
    closeDrawer();
    navigate(path);
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShoppingOutlined style={{ color: ACCENT }} />
          <span>Your cart</span>
        </div>
      }
      open={drawerOpen}
      onClose={closeDrawer}
      width={420}
      styles={{ body: { display: "flex", flexDirection: "column", padding: 0 } }}
    >
      {!isAuthenticated ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
          <Empty description="Please login to view your cart" />
          <Button type="primary" onClick={() => goAndClose(ROUTES.LOGIN)}>Login</Button>
        </div>
      ) : !cart.items?.length ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
          <Empty description="Your cart is empty" />
          <Button type="primary" icon={<ShoppingOutlined />} onClick={() => goAndClose(ROUTES.SHOP)}>
            Continue shopping
          </Button>
        </div>
      ) : (
        <>
          <div style={{ padding: "16px 20px 4px" }}>
            <Text type="secondary" style={{ fontSize: 13 }}>Total</Text>
            <Title level={3} style={{ margin: "2px 0 0", color: ACCENT }}>
              {formatPrice(cart.total)}
            </Title>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px" }}>
            {cart.items.map((item) => {
              const hasSale = item.sale_price && item.sale_price < item.price;
              const unitPrice = item.sale_price || item.price;
              return (
                <div
                  key={item.product_id}
                  style={{
                    display: "flex", gap: 12, padding: 14, marginBottom: 12,
                    background: ACCENT_BG, borderRadius: 12,
                  }}
                >
                  <img
                    src={getProductImage(item.thumbnail)}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#fff" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        style={{ fontWeight: 500, fontSize: 14, color: "#222", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                      >
                        {item.name}
                      </Link>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(item.product_id)}
                        style={{ flexShrink: 0 }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "4px 0 8px" }}>
                      <Text strong style={{ color: ACCENT, fontSize: 14 }}>{formatPrice(unitPrice)}</Text>
                      {hasSale && (
                        <Text delete type="secondary" style={{ fontSize: 12 }}>{formatPrice(item.price)}</Text>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 20, padding: 2 }}>
                        <Button
                          shape="circle"
                          size="small"
                          icon={<MinusOutlined style={{ fontSize: 10 }} />}
                          disabled={item.quantity <= 1}
                          onClick={() => update(item.product_id, item.quantity - 1)}
                          style={{ border: "none" }}
                        />
                        <span style={{ minWidth: 28, textAlign: "center", fontSize: 13 }}>{item.quantity}</span>
                        <Button
                          shape="circle"
                          size="small"
                          icon={<PlusOutlined style={{ fontSize: 10 }} />}
                          disabled={item.quantity >= item.stock}
                          onClick={() => update(item.product_id, item.quantity + 1)}
                          style={{ border: "none" }}
                        />
                      </div>
                      <Text style={{ fontSize: 13 }}>
                        Subtotal: <Text strong style={{ color: ACCENT }}>{formatPrice(unitPrice * item.quantity)}</Text>
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: 20, borderTop: "1px solid #f0f0f0" }}>
            <Button
              block
              size="large"
              icon={<CheckOutlined />}
              onClick={() => goAndClose(ROUTES.CHECKOUT)}
              style={{ background: ACCENT, color: "#fff", border: "none", fontWeight: 500 }}
            >
              Checkout
            </Button>
            <Button block style={{ marginTop: 8 }} onClick={() => goAndClose(ROUTES.SHOP)}>
              Continue shopping
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}
