import { Tag } from "antd";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "../../constants/app.js";

export function OrderStatusBadge({ status }) {
  return <Tag color={ORDER_STATUS_COLORS[status] || "default"}>{status?.toUpperCase()}</Tag>;
}

export function PaymentStatusBadge({ status }) {
  return <Tag color={PAYMENT_STATUS_COLORS[status] || "default"}>{status?.toUpperCase()}</Tag>;
}
