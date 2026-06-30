import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Auth.module.css";
const { Title } = Typography;
export default function ResetPassword() {
  const navigate = useNavigate();
  const onFinish = () => { message.success("Password reset!"); navigate(ROUTES.LOGIN); };
  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Reset Password</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="New Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirm" dependencies={["password"]}
            rules={[{ required: true }, ({ getFieldValue }) => ({
              validator(_, val) { return !val || getFieldValue("password") === val ? Promise.resolve() : Promise.reject("Passwords do not match"); }
            })]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Reset Password</Button>
        </Form>
      </Card>
    </div>
  );
}
