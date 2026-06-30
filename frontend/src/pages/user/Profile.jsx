import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Avatar, Upload, Typography, message, Spin } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { getProfile, updateProfile } from "../../api/index.js";
import { getUserImage } from "../../config/image.js";

const { Title } = Typography;

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    getProfile().then(({ data }) => {
      const u = data.data.user;
      form.setFieldsValue({ first_name: u.first_name, last_name: u.last_name, phone: u.phone, email: u.email });
      if (u.avatar) setAvatar(getUserImage(u.avatar));
    });
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (avatarFile) fd.append("avatar", avatarFile);
      await updateProfile(fd);
      await refreshUser();
      message.success("Profile updated!");
    } catch {
      message.error("Failed to update profile");
    } finally { setLoading(false); }
  };

  const beforeUpload = (file) => {
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
    return false;
  };

  return (
    <div>
      <Title level={3}>My Profile</Title>
      <Card style={{ borderRadius: 10, maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Upload showUploadList={false} beforeUpload={beforeUpload} accept="image/*">
            <div style={{ position: "relative", display: "inline-block" }}>
              <Avatar size={96} src={avatar} icon={<UserOutlined />} style={{ background: "#1677ff" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, background: "#1677ff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <CameraOutlined style={{ color: "#fff", fontSize: 14 }} />
              </div>
            </div>
          </Upload>
          <p style={{ marginTop: 8, color: "#888", fontSize: 13 }}>Click avatar to change photo</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input size="large" />
            </Form.Item>
          </div>
          <Form.Item label="Email" name="email">
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading}>Save Changes</Button>
        </Form>
      </Card>
    </div>
  );
}
