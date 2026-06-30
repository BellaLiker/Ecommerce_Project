import { Form, Input, Button, Card, Typography, Divider, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Auth.module.css";

const { Title, Text } = Typography;

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const onFinish = async (values) => {
    try {
      const user = await login(values);
      message.success("Welcome back!");
      navigate(user.role === "admin" ? ROUTES.ADMIN.DASHBOARD : from, { replace: true });
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Sign In</Title>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
          </div>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Login
          </Button>
        </Form>
        <Divider />
        <Text style={{ display: "block", textAlign: "center" }}>
          Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
        </Text>
      </Card>
    </div>
  );
}
