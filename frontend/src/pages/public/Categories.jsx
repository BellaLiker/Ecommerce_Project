import { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/index.js";
import { getProductImage } from "../../config/image.js";

const { Title } = Typography;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories({ active: true }).then(({ data }) => setCategories(data.data.categories)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><Spin size="large" /></div>;

  return (
    <div className="container page-section">
      <Title level={2} style={{ marginBottom: 32 }}>All Categories</Title>
      <Row gutter={[20, 20]}>
        {categories.map((cat) => (
          <Col key={cat.id} xs={12} sm={8} md={6} lg={4}>
            <Link to={`/shop?category_id=${cat.id}`}>
              <Card hoverable style={{ textAlign: "center", borderRadius: 10 }}
                cover={cat.image
                  ? <img src={getProductImage(cat.image)} alt={cat.name} style={{ height: 140, objectFit: "cover" }} />
                  : <div style={{ height: 140, background: "#f0f5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🛍️</div>
                }>
                <Card.Meta title={cat.name} description={cat.description?.slice(0, 50)} />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
