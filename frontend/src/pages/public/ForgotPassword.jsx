import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Auth.module.css";
const { Title, Text } = Typography;
export default function ForgotPassword() {
  const onFinish = (values) => {
    message.info("If an account exists with that email, a reset link will be sent.");
  };
  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>Forgot Password</Title>
        <Text style={{ display: "block", textAlign: "center", color: "#888", marginBottom: 24 }}>
          Enter your email and we'll send a reset link
        </Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Send Reset Link</Button>
        </Form>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to={ROUTES.LOGIN}>Back to Login</Link>
        </div>
      </Card>
    </div>
  );
}
