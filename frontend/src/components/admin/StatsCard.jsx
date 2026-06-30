import { Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import styles from "./StatsCard.module.css";

export default function StatsCard({ title, value, icon, color = "#1677ff", trend, trendUp }) {
  return (
    <Card className={styles.card}>
      <div className={styles.inner}>
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.value}>{value}</p>
          {trend && (
            <p className={styles.trend} style={{ color: trendUp ? "#52c41a" : "#ff4d4f" }}>
              {trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {trend}
            </p>
          )}
        </div>
        <div className={styles.icon} style={{ background: `${color}20`, color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
