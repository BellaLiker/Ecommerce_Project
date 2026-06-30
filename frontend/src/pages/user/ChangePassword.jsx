import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { changePassword } from "../../api/auth.api.js";
const { Title } = Typography;
export default function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (v) => {
    setLoading(true);
    try {
      await changePassword({ old_password: v.old_password, new_password: v.new_password });
      message.success("Password changed!"); form.resetFields();
    } catch (err) { message.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };
  return (
    <div>
      <Title level={3}>Change Password</Title>
      <Card style={{ borderRadius: 10, maxWidth: 480 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Current Password" name="old_password" rules={[{ required: true }]}><Input.Password size="large" /></Form.Item>
          <Form.Item label="New Password" name="new_password" rules={[{ required: true, min: 6 }]}><Input.Password size="large" /></Form.Item>
          <Form.Item label="Confirm New Password" name="confirm" dependencies={["new_password"]}
            rules={[{ required: true }, ({ getFieldValue }) => ({
              validator(_, val) { return !val || getFieldValue("new_password") === val ? Promise.resolve() : Promise.reject("Passwords do not match"); }
            })]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading}>Change Password</Button>
        </Form>
      </Card>
    </div>
  );
}
