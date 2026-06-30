import { useEffect, useState } from "react";
import { Table, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/index.js";
import { formatPrice, formatDate } from "../../services/format.service.js";
import { ORDER_STATUS_COLORS } from "../../constants/app.js";
import { ROUTES } from "../../constants/routes.js";

const { Title } = Typography;

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetch = (page = 1) => {
    setLoading(true);
    getMyOrders({ page, limit: 10 })
      .then(({ data }) => { setOrders(data.data); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const columns = [
    { title: "Order #", dataIndex: "order_number", render: (v) => <strong>{v}</strong> },
    { title: "Date", dataIndex: "created_at", render: formatDate },
    { title: "Total", dataIndex: "total", render: (v) => formatPrice(v) },
    { title: "Status", dataIndex: "status", render: (v) => <Tag color={ORDER_STATUS_COLORS[v]}>{v?.toUpperCase()}</Tag> },
    { title: "Payment", dataIndex: "payment_status", render: (v) => <Tag>{v?.toUpperCase()}</Tag> },
    { title: "", render: (_, r) => <Link to={ROUTES.USER.ORDER_DETAIL.replace(":id", r.id)}><Button icon={<EyeOutlined />} size="small">View</Button></Link> },
  ];

  return (
    <div>
      <Title level={3}>My Orders</Title>
      <Table
        columns={columns} dataSource={orders} rowKey="id" loading={loading}
        pagination={{ current: pagination.page, pageSize: pagination.limit, total: pagination.total, onChange: fetch }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
