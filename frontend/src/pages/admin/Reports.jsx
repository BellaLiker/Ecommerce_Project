import { Typography } from "antd";
import SalesChart from "../../components/admin/SalesChart.jsx";
const { Title } = Typography;
export default function AdminReports() {
  return (
    <div>
      <Title level={3}>Reports</Title>
      <SalesChart />
    </div>
  );
}
