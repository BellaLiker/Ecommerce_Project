import { useEffect, useState } from "react";
import { Typography, Tag, Button, Popconfirm, message, Rate, Space } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllReviews, updateReviewApproval, deleteReview } from "../../api/index.js";
import DataTable from "../../components/admin/DataTable.jsx";
import { formatDate } from "../../services/format.service.js";
const { Title } = Typography;
export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page:1, limit:15, total:0 });
  const [loading, setLoading] = useState(false);
  const fetch = (page=1) => { setLoading(true); getAllReviews({ page, limit:15 }).then(({ data }) => { setReviews(data.data); setPagination(data.pagination); }).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);
  const handleApprove = async (id, val) => { await updateReviewApproval(id, val); message.success("Updated"); fetch(pagination.page); };
  const handleDelete  = async (id) => { await deleteReview(id); message.success("Deleted"); fetch(pagination.page); };
  const columns = [
    { title: "Product", dataIndex: "product_name", ellipsis: true },
    { title: "User", dataIndex: "user_name" },
    { title: "Rating", dataIndex: "rating", render: (v) => <Rate disabled value={v} style={{ fontSize: 12 }} /> },
    { title: "Review", dataIndex: "body", ellipsis: true, width: 200 },
    { title: "Status", dataIndex: "is_approved", render: (v) => <Tag color={v?"green":"orange"}>{v?"Approved":"Pending"}</Tag> },
    { title: "Date", dataIndex: "created_at", render: formatDate },
    { title: "Actions", render: (_, r) => (
      <Space>
        {!r.is_approved && <Button size="small" icon={<CheckOutlined />} type="primary" onClick={() => handleApprove(r.id, 1)}>Approve</Button>}
        {r.is_approved  && <Button size="small" onClick={() => handleApprove(r.id, 0)}>Unapprove</Button>}
        <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
      </Space>
    )},
  ];
  return (
    <div>
      <Title level={3}>Reviews</Title>
      <DataTable columns={columns} dataSource={reviews} loading={loading} pagination={pagination} onChange={(p) => fetch(p.current)} />
    </div>
  );
}
