import { useEffect, useState } from "react";
import { Typography, Button, Tag, Popconfirm, message, Modal, Form, Input, Select, InputNumber, DatePicker, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../../api/index.js";
import DataTable from "../../components/admin/DataTable.jsx";
import { formatPrice, formatDate } from "../../services/format.service.js";
import dayjs from "dayjs";
const { Title } = Typography;
export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const fetch = () => { setLoading(true); getCoupons().then(({ data }) => setCoupons(data.data.coupons)).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);
  const openAdd  = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (r) => { setEditing(r); form.setFieldsValue({ ...r, expires_at: r.expires_at ? dayjs(r.expires_at) : null }); setOpen(true); };
  const onSave = async (values) => {
    try {
      const payload = { ...values, expires_at: values.expires_at?.toISOString() };
      if (editing) await updateCoupon(editing.id, payload); else await createCoupon(payload);
      message.success(editing ? "Updated" : "Created"); fetch(); setOpen(false);
    } catch { message.error("Failed"); }
  };
  const onDelete = async (id) => { await deleteCoupon(id); message.success("Deleted"); fetch(); };
  const columns = [
    { title: "Code", dataIndex: "code", render: (v) => <Tag color="purple">{v}</Tag> },
    { title: "Type", dataIndex: "type" },
    { title: "Value", render: (_, r) => r.type==="percentage" ? `${r.value}%` : formatPrice(r.value) },
    { title: "Min Order", dataIndex: "min_order_amount", render: formatPrice },
    { title: "Used", render: (_, r) => `${r.used_count}${r.usage_limit ? ` / ${r.usage_limit}` : ""}` },
    { title: "Expires", dataIndex: "expires_at", render: (v) => v ? formatDate(v) : "Never" },
    { title: "Active", dataIndex: "is_active", render: (v) => <Tag color={v?"green":"default"}>{v?"Yes":"No"}</Tag> },
    { title: "Actions", render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
        <Popconfirm title="Delete?" onConfirm={() => onDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
      </Space>
    )},
  ];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
        <Title level={3} style={{ margin:0 }}>Coupons</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add Coupon</Button>
      </div>
      <DataTable columns={columns} dataSource={coupons} loading={loading} rowKey="id" />
      <Modal title={editing?"Edit Coupon":"Add Coupon"} open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={onSave} style={{ marginTop:16 }}>
          <Form.Item label="Code" name="code" rules={[{ required:true }]}><Input style={{ textTransform:"uppercase" }} /></Form.Item>
          <div style={{ display:"flex", gap:12 }}>
            <Form.Item label="Type" name="type" initialValue="fixed" style={{ flex:1 }}>
              <Select options={[{ label:"Fixed ($)", value:"fixed" }, { label:"Percentage (%)", value:"percentage" }]} />
            </Form.Item>
            <Form.Item label="Value" name="value" rules={[{ required:true }]} style={{ flex:1 }}><InputNumber min={0} style={{ width:"100%" }} /></Form.Item>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <Form.Item label="Min Order ($)" name="min_order_amount" initialValue={0} style={{ flex:1 }}><InputNumber min={0} style={{ width:"100%" }} /></Form.Item>
            <Form.Item label="Usage Limit" name="usage_limit" style={{ flex:1 }}><InputNumber min={1} style={{ width:"100%" }} /></Form.Item>
          </div>
          <Form.Item label="Expires At" name="expires_at"><DatePicker style={{ width:"100%" }} showTime /></Form.Item>
          <Button type="primary" htmlType="submit" block>Save Coupon</Button>
        </Form>
      </Modal>
    </div>
  );
}
