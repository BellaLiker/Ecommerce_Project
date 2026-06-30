import { Card, Rate, Button, Tooltip } from "antd";
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { formatPrice } from "../../services/format.service.js";
import { getProductImage } from "../../config/image.js";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const wished = isInWishlist(product.id);
  const price  = product.sale_price || product.price;
  const saved  = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  return (
    <Card
      className={styles.card}
      cover={
        <div className={styles.imgWrap}>
          <Link to={`/product/${product.slug}`}>
            <img
              src={getProductImage(product.thumbnail)}
              alt={product.name}
              className={styles.img}
              onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
            />
          </Link>
          {saved > 0 && <span className={styles.badge}>-{saved}%</span>}
          <div className={styles.actions}>
            {isAuthenticated && (
              <Tooltip title={wished ? "Remove from wishlist" : "Add to wishlist"}>
                <Button
                  shape="circle"
                  icon={wished ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                  onClick={() => toggle(product.id)}
                />
              </Tooltip>
            )}
            <Tooltip title="Quick view">
              <Link to={`/product/${product.slug}`}>
                <Button shape="circle" icon={<EyeOutlined />} />
              </Link>
            </Tooltip>
          </div>
        </div>
      }
      bodyStyle={{ padding: "12px" }}
    >
      <p className={styles.category}>{product.category_name}</p>
      <Link to={`/product/${product.slug}`}>
        <h3 className={styles.name}>{product.name}</h3>
      </Link>
      <Rate disabled defaultValue={product.avg_rating} style={{ fontSize: 12 }} />
      <p style={{ fontSize: 11, color: "#999" }}>({product.review_count})</p>
      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(price)}</span>
        {product.sale_price && (
          <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
        )}
      </div>
      <Button
        type="primary"
        block
        icon={<ShoppingCartOutlined />}
        onClick={() => add(product.id, 1)}
        disabled={product.stock === 0}
        style={{ marginTop: 8 }}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </Card>
  );
}
