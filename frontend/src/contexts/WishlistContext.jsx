import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getWishlist, toggleWishlist } from "../api/index.js";
import { useAuth } from "./AuthContext.jsx";
import { message } from "antd";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await getWishlist();
      setItems(data.data.items);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (productId) => {
    try {
      const { data } = await toggleWishlist(productId);
      message.success(data.message);
      fetchWishlist();
      return data.data.added;
    } catch {}
  };

  const isInWishlist = (productId) => items.some((i) => i.product_id === productId);

  return (
    <WishlistContext.Provider value={{ items, fetchWishlist, toggle, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
