import { Row, Col, Empty, Spin } from "antd";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products = [], loading }) {
  if (loading) return <div className="spinner-wrap"><Spin size="large" /></div>;
  if (!products.length) return <Empty description="No products found" style={{ padding: "40px 0" }} />;

  return (
    <Row gutter={[16, 24]}>
      {products.map((p) => (
        <Col key={p.id} xs={12} sm={8} md={6} lg={6}>
          <ProductCard product={p} />
        </Col>
      ))}
    </Row>
  );
}
