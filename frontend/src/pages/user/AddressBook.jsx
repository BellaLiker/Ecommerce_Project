import { useEffect, useState } from "react";
import { Card, Button, Form, Input, Modal, Popconfirm, Tag, Typography, message, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../../api/index.js";

const { Title } = Typography;

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetch = () => getAddresses().then(({ data }) => setAddresses(data.data.addresses));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (addr) => { setEditing(addr); form.setFieldsValue(addr); setOpen(true); };

  const onSave = async (values) => {
    try {
      if (editing) await updateAddress(editing.id, values);
      else await addAddress(values);
      message.success(editing ? "Address updated" : "Address added");
      fetch(); setOpen(false);
    } catch { message.error("Failed to save address"); }
  };

  const onDelete = async (id) => {
    await deleteAddress(id);
    message.success("Address deleted");
    fetch();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Address Book</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add Address</Button>
      </div>

      <Row gutter={[16, 16]}>
        {addresses.map((addr) => (
          <Col key={addr.id} xs={24} sm={12}>
            <Card style={{ borderRadius: 10 }} extra={
              <div style={{ display: "flex", gap: 8 }}>
                {addr.is_default && <Tag color="blue">Default</Tag>}
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(addr)} />
                <Popconfirm title="Delete this address?" onConfirm={() => onDelete(addr.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            }>
              <p><strong>{addr.full_name}</strong> &bull; {addr.phone}</p>
              <p>{addr.address_line1}</p>
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              <p>{addr.city}, {addr.state} {addr.postal_code}</p>
              <p>{addr.country}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title={editing ? "Edit Address" : "Add Address"} open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={onSave} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item label="Full Name" name="full_name" rules={[{ required: true }]} style={{ flex: 1 }}><Input /></Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true }]} style={{ flex: 1 }}><Input /></Form.Item>
          </div>
          <Form.Item label="Address Line 1" name="address_line1" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Address Line 2" name="address_line2"><Input /></Form.Item>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item label="City" name="city" rules={[{ required: true }]} style={{ flex: 1 }}><Input /></Form.Item>
            <Form.Item label="State" name="state" style={{ flex: 1 }}><Input /></Form.Item>
            <Form.Item label="Postal Code" name="postal_code" style={{ flex: 1 }}><Input /></Form.Item>
          </div>
          <Form.Item label="Country" name="country" initialValue="Cambodia"><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>Save Address</Button>
        </Form>
      </Modal>
    </div>
  );
}
