import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import { getSettings, updateSettings } from "../../api/index.js";
const { Title } = Typography;
export default function AdminSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    getSettings().then(({ data }) => {
      const vals = {};
      data.data.settings.forEach((s) => { vals[s.key] = s.value; });
      form.setFieldsValue(vals);
    }).finally(() => setFetching(false));
  }, []);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const settings = Object.entries(values).map(([key, value]) => ({ key, value: value || "", group: "general" }));
      await updateSettings({ settings });
      message.success("Settings saved!");
    } catch { message.error("Failed"); }
    finally { setLoading(false); }
  };
  if (fetching) return <div className="spinner-wrap"><Spin /></div>;
  return (
    <div>
      <Title level={3}>Settings</Title>
      <Card style={{ borderRadius:10, maxWidth:640 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {[
            ["site_name","Site Name"], ["site_email","Site Email"], ["site_phone","Phone"],
            ["site_address","Address"], ["currency","Currency Code"], ["currency_symbol","Currency Symbol"],
            ["shipping_fee","Shipping Fee ($)"], ["free_shipping_threshold","Free Shipping Threshold ($)"],
            ["meta_title","Meta Title"], ["meta_description","Meta Description"],
          ].map(([name, label]) => (
            <Form.Item key={name} label={label} name={name}>
              {name === "meta_description" ? <Input.TextArea rows={3} /> : <Input />}
            </Form.Item>
          ))}
          <Button type="primary" htmlType="submit" loading={loading} size="large">Save Settings</Button>
        </Form>
      </Card>
    </div>
  );
}
