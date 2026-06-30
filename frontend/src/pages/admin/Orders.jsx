import { useEffect, useState } from "react";
import { Button, Typography, Tag, Select, Space, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../api/index.js";
import DataTable from "../../components/admin/DataTable.jsx";
import { formatPrice, formatDate } from "../../services/format.service.js";
import { ORDER_STATUS_COLORS } from "../../constants/app.js";
import { ROUTES } from "../../constants/routes.js";

const { Title } = Typography;
const STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(undefined);

  const fetch = (page = 1) => {
    setLoading(true);
    getAllOrders({ page, limit: 15, status: statusFilter })
      .then(({ data }) => { setOrders(data.data); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    message.success("Status updated");
    fetch(pagination.page);
  };

  const columns = [
    { title: "Order #", dataIndex: "order_number" },
    { title: "Customer", dataIndex: "customer_name" },
    { title: "Total", dataIndex: "total", render: formatPrice },
    { title: "Status", dataIndex: "status", render: (v, r) => (
      <Select value={v} size="small" style={{ width: 130 }}
        onChange={(s) => handleStatusChange(r.id, s)}
        options={STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} />
    )},
    { title: "Payment", dataIndex: "payment_status", render: (v) => <Tag>{v?.toUpperCase()}</Tag> },
    { title: "Date", dataIndex: "created_at", render: formatDate },
    { title: "", render: (_, r) => <Link to={ROUTES.ADMIN.ORDER_DETAIL.replace(":id", r.id)}><Button size="small" icon={<EyeOutlined />}>View</Button></Link> },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Orders</Title>
        <Select placeholder="Filter by status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}
          options={STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} />
      </div>
      <DataTable columns={columns} dataSource={orders} loading={loading} pagination={pagination} onChange={(p) => fetch(p.current)} />
    </div>
  );
}
