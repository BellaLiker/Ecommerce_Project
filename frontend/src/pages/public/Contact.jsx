import { Form, Input, Button, Card, Typography, Row, Col, message } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
export default function Contact() {
  const onFinish = () => message.success("Message sent! We'll get back to you shortly.");
  return (
    <div className="container page-section">
      <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>Contact Us</Title>
      <Row gutter={[40, 32]}>
        <Col xs={24} md={8}>
          {[
            { icon: <MailOutlined />, label: "Email", value: "info@shopease.com" },
            { icon: <PhoneOutlined />, label: "Phone", value: "+855 12 345 678" },
            { icon: <EnvironmentOutlined />, label: "Address", value: "Phnom Penh, Cambodia" },
          ].map((c) => (
            <div key={c.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 24, color: "#1677ff" }}>{c.icon}</div>
              <div><Text strong>{c.label}</Text><br /><Text type="secondary">{c.value}</Text></div>
            </div>
          ))}
        </Col>
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 10 }}>
            <Form layout="vertical" onFinish={onFinish}>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="Name" name="name" rules={[{ required: true }]} style={{ flex: 1 }}><Input /></Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]} style={{ flex: 1 }}><Input /></Form.Item>
              </div>
              <Form.Item label="Subject" name="subject" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="Message" name="message" rules={[{ required: true }]}><Input.TextArea rows={5} /></Form.Item>
              <Button type="primary" htmlType="submit" size="large">Send Message</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
