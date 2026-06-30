import { useEffect, useState } from "react";
import { List, Button, Badge, Typography, Empty, Spin } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { getNotifications, markRead, markAllRead } from "../../api/index.js";
import { formatDateTime } from "../../services/format.service.js";

const { Title, Text } = Typography;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    getNotifications({ limit: 20 }).then(({ data }) => {
      setNotifications(data.data);
      setUnread(data.unread || 0);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleRead = async (id) => {
    await markRead(id);
    fetch();
  };

  const handleReadAll = async () => {
    await markAllRead();
    fetch();
  };

  if (loading) return <div className="spinner-wrap"><Spin /></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Notifications <Badge count={unread} style={{ marginLeft: 8 }} />
        </Title>
        {unread > 0 && <Button onClick={handleReadAll}>Mark all as read</Button>}
      </div>

      {notifications.length === 0 ? (
        <Empty description="No notifications" icon={<BellOutlined style={{ fontSize: 48, color: "#ccc" }} />} />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(n) => (
            <List.Item
              style={{ background: n.is_read ? "#fff" : "#f0f5ff", padding: "12px 16px", borderRadius: 8, marginBottom: 8, cursor: "pointer" }}
              onClick={() => !n.is_read && handleRead(n.id)}
            >
              <List.Item.Meta
                avatar={<BellOutlined style={{ fontSize: 20, color: n.is_read ? "#ccc" : "#1677ff", marginTop: 4 }} />}
                title={<Text strong={!n.is_read}>{n.title}</Text>}
                description={<>
                  <Text type="secondary">{n.message}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{formatDateTime(n.created_at)}</Text>
                </>}
              />
              {!n.is_read && <Badge dot />}
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
