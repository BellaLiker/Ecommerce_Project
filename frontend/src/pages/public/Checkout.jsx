import { useState } from "react";
import { Form, Input, Select, Button, Card, Divider, Typography, message, Steps, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { placeOrder, validateCoupon } from "../../api/index.js";
import { formatPrice } from "../../services/format.service.js";
import { ROUTES } from "../../constants/routes.js";

const { Title, Text } = Typography;

export default function Checkout() {
  const { cart, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [step, setStep]             = useState(0);
  const [loading, setLoading]       = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount]     = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!isAuthenticated) { navigate(ROUTES.LOGIN); return null; }

  const shipping = cart.total >= 100 ? 0 : 5;
  const total    = Math.max(0, cart.total - discount + shipping);

  const applyCoupon = async () => {
    try {
      const { data } = await validateCoupon({ code: couponCode, order_amount: cart.total });
      setDiscount(data.data.discount);
      setCouponApplied(true);
      message.success(`Coupon applied! You save ${formatPrice(data.data.discount)}`);
    } catch (err) {
      message.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await placeOrder({
        shipping_address: values,
        payment_method: paymentMethod,
        coupon_code: couponApplied ? couponCode : undefined,
        notes: values.notes,
      });
      await clear();
      message.success("Order placed successfully!");
      navigate(ROUTES.USER.ORDERS);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-section">
      <Title level={3}>Checkout</Title>
      <Steps current={step} style={{ marginBottom: 32 }} items={[
        { title: "Shipping" }, { title: "Payment" }, { title: "Confirm" },
      ]} />
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Card title="Shipping Address" style={{ marginBottom: 16, borderRadius: 10 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="Full Name" name="full_name" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
                <Form.Item label="Phone" name="phone" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
              </div>
              <Form.Item label="Address Line 1" name="address_line1" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Address Line 2" name="address_line2">
                <Input />
              </Form.Item>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="City" name="city" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
                <Form.Item label="State" name="state" style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
                <Form.Item label="Postal Code" name="postal_code" style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
              </div>
              <Form.Item label="Country" name="country" initialValue="Cambodia">
                <Input />
              </Form.Item>
              <Form.Item label="Order Notes" name="notes">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Card>

            <Card title="Payment Method" style={{ marginBottom: 16, borderRadius: 10 }}>
              <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Radio value="cod" style={{ display: "block", marginBottom: 8 }}>Cash on Delivery</Radio>
                <Radio value="card" style={{ display: "block", marginBottom: 8 }}>Credit / Debit Card</Radio>
                <Radio value="bank_transfer" style={{ display: "block" }}>Bank Transfer</Radio>
              </Radio.Group>
            </Card>

            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Place Order ({formatPrice(total)})
            </Button>
          </Form>
        </div>

        <Card style={{ width: 300, height: "fit-content", borderRadius: 10 }}>
          <Title level={4}>Order Summary</Title>
          {cart.items?.map((item) => (
            <div key={item.product_id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <Text ellipsis style={{ maxWidth: 180 }}>{item.name} x{item.quantity}</Text>
              <Text>{formatPrice((item.sale_price || item.price) * item.quantity)}</Text>
            </div>
          ))}
          <Divider />
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={couponApplied} />
            <Button onClick={applyCoupon} disabled={couponApplied || !couponCode}>Apply</Button>
          </div>
          {[
            ["Subtotal", formatPrice(cart.total)],
            ["Discount", discount ? `-${formatPrice(discount)}` : "-"],
            ["Shipping", shipping === 0 ? "Free" : formatPrice(shipping)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <Text>{k}</Text><Text>{v}</Text>
            </div>
          ))}
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4} style={{ margin: 0 }}>Total</Title>
            <Title level={4} style={{ margin: 0, color: "#1677ff" }}>{formatPrice(total)}</Title>
          </div>
        </Card>
      </div>
    </div>
  );
}
