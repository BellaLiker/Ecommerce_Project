import { useEffect, useState } from "react";
import { Typography, Button, Tag, Popconfirm, message, Input, Space, Avatar } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { getAllUsers, toggleUserStatus, deleteUser } from "../../api/index.js";
import DataTable from "../../components/admin/DataTable.jsx";
import { formatDate } from "../../services/format.service.js";
import { getUserImage } from "../../config/image.js";

const { Title } = Typography;
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page:1, limit:15, total:0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const fetch = (page=1) => { setLoading(true); getAllUsers({ page, limit:15, search }).then(({ data }) => { setUsers(data.data); setPagination(data.pagination); }).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, [search]);
  const handleToggle = async (id) => { await toggleUserStatus(id); message.success("Status updated"); fetch(pagination.page); };
  const handleDelete = async (id) => { await deleteUser(id); message.success("Deleted"); fetch(pagination.page); };
  const columns = [
    { title: "Avatar", dataIndex: "avatar", width: 60, render: (v, r) => <Avatar src={v ? getUserImage(v) : null} icon={<UserOutlined />}>{r.first_name?.[0]}</Avatar> },
    { title: "Name", render: (_, r) => `${r.first_name} ${r.last_name}` },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role", render: (v) => <Tag color={v==="admin"?"red":"blue"}>{v?.toUpperCase()}</Tag> },
    { title: "Status", dataIndex: "is_active", render: (v) => <Tag color={v?"green":"default"}>{v?"Active":"Inactive"}</Tag> },
    { title: "Joined", dataIndex: "created_at", render: formatDate },
    { title: "Actions", render: (_, r) => (
      <Space>
        <Button size="small" onClick={() => handleToggle(r.id)}>{r.is_active ? "Deactivate" : "Activate"}</Button>
        <Popconfirm title="Delete user?" onConfirm={() => handleDelete(r.id)}><Button size="small" danger>Delete</Button></Popconfirm>
      </Space>
    )},
  ];
  return (
    <div>
      <Title level={3}>Users</Title>
      <Input prefix={<SearchOutlined />} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom:16, maxWidth:300 }} />
      <DataTable columns={columns} dataSource={users} loading={loading} pagination={pagination} onChange={(p) => fetch(p.current)} />
    </div>
  );
}
