import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { storage } from "../services/storage.service.js";
import * as AuthAPI from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => storage.get("user"));
  const [token, setToken]     = useState(() => localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(false);

  const saveAuth = (access_token, userData) => {
    localStorage.setItem("access_token", access_token);
    storage.set("user", userData);
    setToken(access_token);
    setUser(userData);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await AuthAPI.login(credentials);
      saveAuth(data.data.access_token, data.data.user);
      return data.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await AuthAPI.register(formData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try { await AuthAPI.logout(); } catch {}
    localStorage.removeItem("access_token");
    storage.remove("user");
    setUser(null);
    setToken(null);
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await AuthAPI.getMe();
      storage.set("user", data.data.user);
      setUser(data.data.user);
    } catch {
      logout();
    }
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, isAuthenticated, login, register, logout, refreshUser, saveAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
