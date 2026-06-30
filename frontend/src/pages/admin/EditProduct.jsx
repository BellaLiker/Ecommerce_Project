import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch, Button, Card, Typography, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct, getCategories, getBrands } from "../../api/index.js";
import ImageUpload from "../../components/admin/ImageUpload.jsx";
import { ROUTES } from "../../constants/routes.js";

const { Title } = Typography;

export default function EditProduct() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    Promise.all([getProductById(id), getCategories(), getBrands()]).then(([p, c, b]) => {
      const prod = p.data.data.product;
      form.setFieldsValue({ ...prod, is_active: !!prod.is_active, is_featured: !!prod.is_featured });
      setCategories(c.data.data.categories);
      setBrands(b.data.data.brands);
    }).finally(() => setFetching(false));
  }, [id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
      images.forEach((f) => fd.append("images", f));
      await updateProduct(id, fd);
      message.success("Product updated!");
      navigate(ROUTES.ADMIN.PRODUCTS);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update");
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="spinner-wrap"><Spin /></div>;

  return (
    <div>
      <Title level={3}>Edit Product</Title>
      <Card style={{ borderRadius: 10 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 300 }}>
              <Form.Item label="Product Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="Short Description" name="short_desc"><Input /></Form.Item>
              <Form.Item label="Description" name="description"><Input.TextArea rows={5} /></Form.Item>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="Price ($)" name="price" rules={[{ required: true }]} style={{ flex: 1 }}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
                <Form.Item label="Sale Price ($)" name="sale_price" style={{ flex: 1 }}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="Stock" name="stock" style={{ flex: 1 }}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
                <Form.Item label="SKU" name="sku" style={{ flex: 1 }}><Input /></Form.Item>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Item label="Category" name="category_id" rules={[{ required: true }]}>
                <Select options={categories.map((c) => ({ label: c.name, value: c.id }))} />
              </Form.Item>
              <Form.Item label="Brand" name="brand_id">
                <Select options={brands.map((b) => ({ label: b.name, value: b.id }))} allowClear />
              </Form.Item>
              <Form.Item label="Active" name="is_active" valuePropName="checked"><Switch /></Form.Item>
              <Form.Item label="Featured" name="is_featured" valuePropName="checked"><Switch /></Form.Item>
              <Form.Item label="Replace Images (optional)">
                <ImageUpload multiple onChange={setImages} />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading}>Update Product</Button>
            <Button onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}>Cancel</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
