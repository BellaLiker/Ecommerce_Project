import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from "../api/index.js";
import { useAuth } from "./AuthContext.jsx";
import { message } from "antd";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart]     = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await getCart();
      setCart(data.data);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const add = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await addToCart({ product_id: productId, quantity });
      setCart(data.data);
      message.success("Added to cart");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to add");
    } finally { setLoading(false); }
  };

  const update = async (productId, quantity) => {
    try {
      const { data } = await updateCart(productId, { quantity });
      setCart(data.data);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update");
    }
  };

  const remove = async (productId) => {
    try {
      const { data } = await removeFromCart(productId);
      setCart(data.data);
      message.success("Removed from cart");
    } catch {}
  };

  const clear = async () => {
    try {
      await clearCart();
      setCart({ items: [], total: 0 });
    } catch {}
  };

  const itemCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, fetchCart, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
