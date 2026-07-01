import { useEffect, useState } from "react";
import { Button, Typography, Popconfirm, message, Input, Space, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { getProducts, deleteProduct } from "../../api/index.js";
import DataTable from "../../components/admin/DataTable.jsx";
import ProductFormModal from "../../components/admin/ProductFormModal.jsx";
import { formatPrice } from "../../services/format.service.js";
import { getProductImage } from "../../config/image.js";

const { Title } = Typography;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetch = (page = 1) => {
    setLoading(true);
    getProducts({ page, limit: 10, search })
      .then(({ data }) => { setProducts(data.data); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [search]);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    message.success("Product deleted");
    fetch(pagination.page);
  };

  const openAddModal = () => {
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (id) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSaved = () => {
    setModalOpen(false);
    fetch(pagination.page);
  };

  const columns = [
    { title: "Image", dataIndex: "thumbnail", width: 70, render: (v) => (
      <Image src={getProductImage(v)} width={50} height={50} style={{ objectFit: "cover", borderRadius: 6 }}
        fallback="https://via.placeholder.com/50" />
    )},
    { title: "Name", dataIndex: "name", ellipsis: true },
    { title: "Category", dataIndex: "category_name" },
    { title: "Price", dataIndex: "price", render: formatPrice },
    { title: "Sale Price", dataIndex: "sale_price", render: (v) => v ? formatPrice(v) : "-" },
    { title: "Stock", dataIndex: "stock" },
    { title: "Status", dataIndex: "is_active", render: (v) => v ? "Active" : "Inactive" },
    { title: "Actions", width: 110, render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(r.id)} />
        <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(r.id)}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Products</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>Add Product</Button>
      </div>
      <Input prefix={<SearchOutlined />} placeholder="Search products..." value={search}
        onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 16, maxWidth: 300 }} />
      <DataTable columns={columns} dataSource={products} loading={loading} pagination={pagination}
        onChange={(p) => fetch(p.current)} />

      <ProductFormModal
        open={modalOpen}
        productId={editingId}
        onClose={closeModal}
        onSaved={handleSaved}
      />
    </div>
  );
}
