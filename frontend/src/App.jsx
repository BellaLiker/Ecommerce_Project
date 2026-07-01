import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WishlistProvider } from "./contexts/WishlistContext.jsx";
import AppRoutes from "./routes/index.jsx";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={{ token: { colorPrimary: "#656565", borderRadius: 8 } }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRoutes />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
