import { useEffect, useState } from "react";
import { Button, Row, Col, Typography, Spin } from "antd";
import { Link } from "react-router-dom";
import { getProducts, getCategories, getBrands } from "../../api/index.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import { getProductImage } from "../../config/image.js";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Home.module.css";

const { Title, Text } = Typography;

export default function Home() {
  const [featured, setFeatured]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ is_featured: true, limit: 8 }),
      getCategories({ active: true }),
      getBrands({ active: true }),
    ]).then(([p, c, b]) => {
      setFeatured(p.data.data);
      setCategories(c.data.data.categories.slice(0, 8));
      setBrands(b.data.data.brands.slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <Title style={{ color: "#fff", fontSize: 48, marginBottom: 16 }}>
            Shop the Best.<br />Pay the Less.
          </Title>
          <Text style={{ color: "#ffffffcc", fontSize: 18 }}>
            Discover thousands of products from top brands
          </Text>
          <div style={{ marginTop: 32, display: "flex", gap: 16 }}>
            <Link to={ROUTES.SHOP}>
              <Button type="primary" size="large" style={{ height: 48, padding: "0 32px" }}>
                Shop Now
              </Button>
            </Link>
            <Link to={ROUTES.CATEGORIES}>
              <Button size="large" ghost style={{ height: 48, padding: "0 32px" }}>
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="page-section container">
          <div className="flex-between mb-16">
            <Title level={3} style={{ margin: 0 }}>Shop by Category</Title>
            <Link to={ROUTES.CATEGORIES}><Button type="link">View All</Button></Link>
          </div>
          <Row gutter={[16, 16]}>
            {categories.map((cat) => (
              <Col key={cat.id} xs={12} sm={8} md={6} lg={3}>
                <Link to={`${ROUTES.SHOP}?category_id=${cat.id}`}>
                  <div className={styles.catCard}>
                    <div className={styles.catImg}>
                      {cat.image
                        ? <img src={getProductImage(cat.image)} alt={cat.name} />
                        : <span style={{ fontSize: 32 }}>🛍️</span>}
                    </div>
                    <p className={styles.catName}>{cat.name}</p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </section>
      )}

      {/* Featured Products */}
      <section className="page-section container">
        <div className="flex-between mb-16">
          <Title level={3} style={{ margin: 0 }}>Featured Products</Title>
          <Link to={ROUTES.SHOP}><Button type="link">View All</Button></Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="page-section" style={{ background: "#fff", padding: "40px 0" }}>
          <div className="container">
            <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>Top Brands</Title>
            <Row gutter={[24, 24]} justify="center">
              {brands.map((b) => (
                <Col key={b.id} xs={8} sm={6} md={4} lg={3}>
                  <Link to={`${ROUTES.SHOP}?brand_id=${b.id}`}>
                    <div className={styles.brandCard}>
                      {b.logo
                        ? <img src={getProductImage(b.logo)} alt={b.name} style={{ height: 40, objectFit: "contain" }} />
                        : <span style={{ fontWeight: 700, color: "#555" }}>{b.name}</span>}
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}
    </div>
  );
}
