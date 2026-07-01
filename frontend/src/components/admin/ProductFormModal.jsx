import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Button, Modal, message, Spin } from "antd";
import { createProduct, updateProduct, getCategories, getBrands, getProductById } from "../../api/index.js";
import ImageUpload from "./ImageUpload.jsx";

export default function ProductFormModal({ open, productId, onClose, onSaved }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  const isEdit = Boolean(productId);

  // Load categories + brands whenever modal opens
  useEffect(() => {
    if (!open) return;
    Promise.all([getCategories(), getBrands()]).then(([c, b]) => {
      setCategories(c.data.data.categories);
      setBrands(b.data.data.brands);
    });
  }, [open]);

  // Load product data when editing, reset form when adding
  useEffect(() => {
    if (!open) return;
    setImages([]);
    if (isEdit) {
      setFetching(true);
      getProductById(productId)
        .then(({ data }) => {
          const p = data.data.product;
          form.setFieldsValue({
            name: p.name,
            short_desc: p.short_desc,
            description: p.description,
            price: p.price,
            sale_price: p.sale_price,
            stock: p.stock,
            sku: p.sku,
            category_id: p.category_id,
            brand_id: p.brand_id,
            is_active: Boolean(p.is_active),
            is_featured: Boolean(p.is_featured),
          });
          setExistingThumbnail(p.thumbnail);
        })
        .catch(() => message.error("Failed to load product"))
        .finally(() => setFetching(false));
    } else {
      form.resetFields();
      setExistingThumbnail(null);
    }
  }, [open, productId]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "boolean") {
          fd.append(k, v ? 1 : 0);
        } else {
          fd.append(k, v);
        }
      });
      images.forEach((f) => fd.append("images", f));

      if (isEdit) {
        await updateProduct(productId, fd);
        message.success("Product updated");
      } else {
        await createProduct(fd);
        message.success("Product created");
      }
      onSaved();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit product" : "Add product"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnClose
    >
      {fetching ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}><Spin /></div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 280 }}>
              <Form.Item label="Product name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Short description" name="short_desc">
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="Price ($)" name="price" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Sale price ($)" name="sale_price" style={{ flex: 1 }}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item label="Stock" name="stock" initialValue={0} style={{ flex: 1 }}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="SKU" name="sku" style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Item label="Category" name="category_id" rules={[{ required: true }]}>
                <Select options={categories.map((c) => ({ label: c.name, value: c.id }))} />
              </Form.Item>
              <Form.Item label="Brand" name="brand_id">
                <Select options={brands.map((b) => ({ label: b.name, value: b.id }))} allowClear />
              </Form.Item>
              <Form.Item label="Active" name="is_active" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
              <Form.Item label="Featured" name="is_featured" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
              <Form.Item label="Product images">
                {isEdit && existingThumbnail && (
                  <img
                    src={existingThumbnail}
                    alt="Current thumbnail"
                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, marginBottom: 8, display: "block" }}
                  />
                )}
                <ImageUpload multiple onChange={setImages} />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? "Save changes" : "Create product"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}
