import { Card, Select } from "antd";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getSalesChart } from "../../api/index.js";

export default function SalesChart() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    getSalesChart(days)
      .then(({ data: res }) => setData(res.data.chart))
      .catch(() => {});
  }, [days]);

  return (
    <Card
      title="Sales Overview"
      extra={
        <Select value={days} onChange={setDays} style={{ width: 120 }}>
          <Select.Option value={7}>Last 7 days</Select.Option>
          <Select.Option value={30}>Last 30 days</Select.Option>
          <Select.Option value={90}>Last 90 days</Select.Option>
        </Select>
      }
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#1677ff" name="Revenue ($)" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#52c41a" name="Orders" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
