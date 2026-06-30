import { Card, Typography, Slider, Checkbox, Divider, Button } from "antd";
import { useState, useEffect } from "react";

const { Title } = Typography;

export default function ProductFilter({ categories = [], brands = [], filters, onFilter }) {
  const [local, setLocal] = useState(filters || {});

  const apply = () => onFilter(local);
  const reset = () => { setLocal({}); onFilter({}); };

  const set = (key, val) => setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <Card size="small">
      <Title level={5} style={{ marginBottom: 16 }}>Filters</Title>

      <Divider orientation="left" plain>Price Range</Divider>
      <Slider
        range
        min={0} max={5000} step={10}
        value={[local.min_price || 0, local.max_price || 5000]}
        onChange={([min, max]) => { set("min_price", min); set("max_price", max); }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999" }}>
        <span>${local.min_price || 0}</span>
        <span>${local.max_price || 5000}</span>
      </div>

      <Divider orientation="left" plain>Category</Divider>
      <Checkbox.Group
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
        value={local.category_id ? [local.category_id] : []}
        onChange={([v]) => set("category_id", v)}
        options={categories.map((c) => ({ label: c.name, value: c.id }))}
      />

      <Divider orientation="left" plain>Brand</Divider>
      <Checkbox.Group
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
        value={local.brand_id ? [local.brand_id] : []}
        onChange={([v]) => set("brand_id", v)}
        options={brands.map((b) => ({ label: b.name, value: b.id }))}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Button type="primary" block onClick={apply}>Apply</Button>
        <Button block onClick={reset}>Reset</Button>
      </div>
    </Card>
  );
}
