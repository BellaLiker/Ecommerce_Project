import { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import { getBrands } from "../../api/index.js";
import { getProductImage } from "../../config/image.js";

const { Title } = Typography;
export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getBrands({ active: true }).then(({ data }) => setBrands(data.data.brands)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="spinner-wrap"><Spin size="large" /></div>;
  return (
    <div className="container page-section">
      <Title level={2} style={{ marginBottom: 32 }}>All Brands</Title>
      <Row gutter={[20, 20]}>
        {brands.map((b) => (
          <Col key={b.id} xs={12} sm={8} md={6} lg={4}>
            <Link to={`/shop?brand_id=${b.id}`}>
              <Card hoverable style={{ textAlign: "center", borderRadius: 10, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {b.logo ? <img src={getProductImage(b.logo)} alt={b.name} style={{ maxHeight: 60, objectFit: "contain" }} />
                  : <Title level={4} style={{ margin: 0 }}>{b.name}</Title>}
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
