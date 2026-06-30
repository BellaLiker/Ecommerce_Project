import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button, InputNumber, Rate, Tag, Tabs, Breadcrumb, Image, Spin, message } from "antd";
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { getProductBySlug } from "../../api/product.api.js";
import { getProductReviews } from "../../api/index.js";
import { useCart } from "../../contexts/CartContext.jsx";
import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { formatPrice, formatDate } from "../../services/format.service.js";
import { getProductImage, getUserImage } from "../../config/image.js";
import { Rate as AntRate, Avatar, Empty } from "antd";
import styles from "./ProductDetails.module.css";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [qty, setQty]           = useState(1);
  const [loading, setLoading]   = useState(true);
  const [mainImg, setMainImg]   = useState(null);

  useEffect(() => {
    getProductBySlug(slug)
      .then(({ data }) => {
        setProduct(data.data.product);
        setMainImg(data.data.product.thumbnail);
      })
      .catch(() => navigate("/404"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product) {
      getProductReviews(product.id, { limit: 10 })
        .then(({ data }) => setReviews(data.data))
        .catch(() => {});
    }
  }, [product]);

  if (loading) return <div className="spinner-wrap"><Spin size="large" /></div>;
  if (!product) return null;

  const wished = isInWishlist(product.id);
  const price  = product.sale_price || product.price;
  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);

  const handleAddToCart = () => {
    if (!isAuthenticated) { message.warning("Please login to add to cart"); return; }
    add(product.id, qty);
  };

  return (
    <div className="container page-section">
      <Breadcrumb style={{ marginBottom: 24 }} items={[
        { title: "Home", href: "/" },
        { title: "Shop", href: "/shop" },
        { title: product.category_name, href: `/shop?category_id=${product.category_id}` },
        { title: product.name },
      ]} />

      <Row gutter={[40, 32]}>
        {/* Images */}
        <Col xs={24} md={12}>
          <div className={styles.mainImg}>
            <Image
              src={getProductImage(mainImg)}
              alt={product.name}
              style={{ width: "100%", maxHeight: 480, objectFit: "contain" }}
              fallback="https://via.placeholder.com/480x480?text=No+Image"
            />
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={getProductImage(img)}
                  alt=""
                  className={`${styles.thumb} ${mainImg === img ? styles.thumbActive : ""}`}
                  onClick={() => setMainImg(img)}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Img"; }}
                />
              ))}
            </div>
          )}
        </Col>

        {/* Info */}
        <Col xs={24} md={12}>
          <Tag color="blue">{product.category_name}</Tag>
          {product.brand_name && <Tag>{product.brand_name}</Tag>}
          <h1 className={styles.title}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
            <Rate disabled value={product.avg_rating} style={{ fontSize: 16 }} />
            <span style={{ color: "#999" }}>({product.review_count} reviews)</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(price)}</span>
            {product.sale_price && (
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            )}
            {product.sale_price && (
              <Tag color="red">{Math.round((1 - product.sale_price / product.price) * 100)}% OFF</Tag>
            )}
          </div>

          <p className={styles.desc}>{product.short_desc}</p>

          <div className={styles.stock}>
            {product.stock > 0
              ? <Tag color="success">In Stock ({product.stock} available)</Tag>
              : <Tag color="error">Out of Stock</Tag>}
          </div>

          {product.sku && <p style={{ color: "#999", fontSize: 13 }}>SKU: {product.sku}</p>}

          {product.stock > 0 && (
            <div className={styles.actions}>
              <InputNumber min={1} max={product.stock} value={qty} onChange={setQty} style={{ width: 80 }} />
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} style={{ flex: 1 }}>
                Add to Cart
              </Button>
              {isAuthenticated && (
                <Button
                  size="large"
                  icon={wished ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                  onClick={() => toggle(product.id)}
                />
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* Tabs */}
      <div style={{ marginTop: 48 }}>
        <Tabs items={[
          {
            key: "desc",
            label: "Description",
            children: <div style={{ lineHeight: 1.8, color: "#555" }}>{product.description || "No description available."}</div>,
          },
          {
            key: "reviews",
            label: `Reviews (${reviews.length})`,
            children: reviews.length === 0 ? <Empty description="No reviews yet" /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar src={r.avatar ? getUserImage(r.avatar) : null}>{r.user_name?.[0]}</Avatar>
                      <div>
                        <strong>{r.user_name}</strong>
                        <div><AntRate disabled value={r.rating} style={{ fontSize: 12 }} /></div>
                      </div>
                      <span style={{ marginLeft: "auto", color: "#999", fontSize: 12 }}>{formatDate(r.created_at)}</span>
                    </div>
                    {r.title && <p style={{ fontWeight: 600, marginTop: 8 }}>{r.title}</p>}
                    <p style={{ color: "#555", marginTop: 4 }}>{r.body}</p>
                  </div>
                ))}
              </div>
            ),
          },
        ]} />
      </div>
    </div>
  );
}
