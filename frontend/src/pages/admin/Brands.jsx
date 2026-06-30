import { useEffect, useState } from "react";
import { Button, Typography, Popconfirm, message, Modal, Form, Input, Switch, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../../api/index.js";
import DataTable from "../../components/admin/DataTable.jsx";
import ImageUpload from "../../components/admin/ImageUpload.jsx";
const { Title } = Typography;
export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [form] = Form.useForm();
  const fetch = () => { setLoading(true); getBrands().then(({ data }) => setBrands(data.data.brands)).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);
  const openAdd  = () => { setEditing(null); form.resetFields(); setLogoFile(null); setOpen(true); };
  const openEdit = (r) => { setEditing(r); form.setFieldsValue({ ...r, is_active: !!r.is_active }); setLogoFile(null); setOpen(true); };
  const onSave = async (values) => {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
      if (logoFile) fd.append("images", logoFile);
      if (editing) await updateBrand(editing.id, fd); else await createBrand(fd);
      message.success(editing ? "Brand updated" : "Brand created"); fetch(); setOpen(false);
    } catch { message.error("Failed"); }
  };
  const onDelete = async (id) => { await deleteBrand(id); message.success("Deleted"); fetch(); };
  const columns = [
    { title: "Name", dataIndex: "name" }, { title: "Slug", dataIndex: "slug" },
    { title: "Website", dataIndex: "website", render: (v) => v ? <a href={v} target="_blank" rel="noreferrer">{v}</a> : "-" },
    { title: "Active", dataIndex: "is_active", render: (v) => v ? "Yes" : "No" },
    { title: "Actions", width: 100, render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
        <Popconfirm title="Delete?" onConfirm={() => onDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
      </Space>
    )},
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Brands</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add Brand</Button>
      </div>
      <DataTable columns={columns} dataSource={brands} loading={loading} rowKey="id" />
      <Modal title={editing ? "Edit Brand" : "Add Brand"} open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={onSave} style={{ marginTop: 16 }}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Slug" name="slug"><Input /></Form.Item>
          <Form.Item label="Website" name="website"><Input /></Form.Item>
          <Form.Item label="Description" name="description"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
          <Form.Item label="Logo"><ImageUpload onChange={(files) => setLogoFile(files[0])} /></Form.Item>
          <Button type="primary" htmlType="submit" block>Save</Button>
        </Form>
      </Modal>
    </div>
  );
}
