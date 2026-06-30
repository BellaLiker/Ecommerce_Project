import { Typography, Row, Col, Card } from "antd";
const { Title, Paragraph } = Typography;
export default function About() {
  return (
    <div className="container page-section">
      <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>About ShopEase</Title>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Title level={3}>Our Story</Title>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: "#555" }}>
            ShopEase was founded with a simple mission: to make online shopping easy, affordable, and enjoyable for everyone.
            We connect buyers with the best products from top brands around the world.
          </Paragraph>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: "#555" }}>
            Since our launch, we've served thousands of happy customers and continue to grow our product catalog every day.
          </Paragraph>
        </Col>
        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            {[
              { title: "10,000+", label: "Products" },
              { title: "50,000+", label: "Customers" },
              { title: "500+", label: "Brands" },
              { title: "99%", label: "Satisfaction" },
            ].map((s) => (
              <Col span={12} key={s.label}>
                <Card style={{ textAlign: "center", borderRadius: 10 }}>
                  <Title level={2} style={{ color: "#1677ff", margin: 0 }}>{s.title}</Title>
                  <p style={{ color: "#888", marginTop: 4 }}>{s.label}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
