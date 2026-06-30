import { Form, Input, Button, Card, Typography, Divider, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Auth.module.css";

const { Title, Text } = Typography;

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await register(values);
      message.success("Account created! Please login.");
      navigate(ROUTES.LOGIN);
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Create Account</Title>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input size="large" />
            </Form.Item>
          </div>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirm" dependencies={["password"]}
            rules={[{ required: true }, ({ getFieldValue }) => ({
              validator(_, val) {
                return !val || getFieldValue("password") === val ? Promise.resolve() : Promise.reject("Passwords do not match");
              }
            })]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>Register</Button>
        </Form>
        <Divider />
        <Text style={{ display: "block", textAlign: "center" }}>
          Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
        </Text>
      </Card>
    </div>
  );
}
