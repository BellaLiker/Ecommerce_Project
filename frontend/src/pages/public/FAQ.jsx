import { Collapse, Typography } from "antd";
const { Title } = Typography;
const faqs = [
  { q: "How do I track my order?", a: "After placing an order, go to My Orders in your dashboard to track its status in real-time." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Credit/Debit Cards, and Bank Transfer." },
  { q: "Can I return a product?", a: "Yes, we have a 30-day return policy for most items. Contact support to initiate a return." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express options are available at checkout." },
  { q: "Is my payment information secure?", a: "Yes, all payment data is encrypted and we never store your card details." },
  { q: "How do I apply a coupon?", a: "Enter your coupon code in the cart or checkout page in the designated coupon field." },
];
export default function FAQ() {
  return (
    <div className="container page-section">
      <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>Frequently Asked Questions</Title>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Collapse size="large" items={faqs.map((f, i) => ({ key: i, label: f.q, children: <p style={{ color: "#555", lineHeight: 1.7 }}>{f.a}</p> }))} />
      </div>
    </div>
  );
}
