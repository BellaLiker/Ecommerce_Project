import { Row, Col, Button, Empty } from "antd";
import { Link } from "react-router-dom";
import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { useCart } from "../../contexts/CartContext.jsx";
import { formatPrice } from "../../services/format.service.js";
import { getProductImage } from "../../config/image.js";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card } from "antd";

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { add } = useCart();

  if (!items.length) return (
    <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: 16 }}>
      <Empty description="Your wishlist is empty" />
      <Link to="/shop"><Button type="primary">Browse Products</Button></Link>
    </div>
  );

  return (
    <div className="container page-section">
      <h2 style={{ marginBottom: 24 }}>My Wishlist ({items.length})</h2>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.id} xs={12} sm={8} md={6}>
            <Card cover={
              <img src={getProductImage(item.thumbnail)} alt={item.name}
                style={{ height: 200, objectFit: "cover" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/200"; }} />
            } actions={[
              <Button type="text" icon={<ShoppingCartOutlined />} onClick={() => add(item.product_id, 1)}>Add to Cart</Button>,
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => toggle(item.product_id)}>Remove</Button>,
            ]}>
              <Link to={`/product/${item.slug}`}><p style={{ fontWeight: 600 }}>{item.name}</p></Link>
              <p style={{ color: "#1677ff", fontWeight: 700 }}>{formatPrice(item.sale_price || item.price)}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
