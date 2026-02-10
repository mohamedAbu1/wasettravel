"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { decodeJwt } from "@/lib/utils/JWToken";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // إدارة التوكين
  const saveToken = (token) => {
    localStorage.setItem("sb_access", token);
    document.cookie = `sb_access=${token}; path=/; max-age=${2 * 24 * 60 * 60}`;
  };

const removeToken = () => {
  localStorage.removeItem("sb_access");
  // مسح الكوكيز من الفرونت (لو مش HttpOnly)
  document.cookie = "sb_access=; path=/; max-age=0";
};


  const getToken = () => {
    const lsToken = localStorage.getItem("sb_access");
    if (lsToken) return lsToken;
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sb_access="))
      ?.split("=")[1];
    return cookieToken || null;
  };

  // عند تحميل التطبيق: تحقق من وجود التوكين وعيّن user
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        setUser(decoded);
        setIsLoggedIn(true);
      } else {
        removeToken();
        setUser(null);
        setIsLoggedIn(false);
      }
    }
  }, []);

  // التسجيل
  const register = async (email, password, name, gender, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
        name,
        gender,
      });
      const data = res.data;

      if (!data.user) throw new Error(data.error || "Registration failed");

      saveToken(data.token);
      const decoded = decodeJwt(data.token);
      setUser(decoded);
      setIsLoggedIn(true);
      toast.success("✅ Account created successfully!");
      if (onSuccess) setOpen(false);

      return decoded;
    } catch (err) {
      setError(err.message);
      toast.error("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // الدخول
  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      const data = res.data;

      if (!data.user || !data.token)
        throw new Error(data.error || "Login failed");

      saveToken(data.token);
      const decoded = decodeJwt(data.token);
      setUser(decoded);
      setIsLoggedIn(true);

      if (onSuccess) onSuccess();

      return decoded;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // الخروج
// الخروج
const logout = async () => {
  try {
    // استدعاء الـ API لمسح الكوكيز HttpOnly من السيرفر
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.error("❌ Error clearing cookies on server:", err);
  }

  // مسح بيانات المستخدم من الـ state
  setUser(null);
  setIsLoggedIn(false);

  // مسح التوكن من localStorage والكوكيز العادية
  removeToken();

  // إشعار للمستخدم
  toast.info("🚪 Logged out successfully");
};


  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        loading,
        error,
        isLoggedIn,
        open,
        setOpen,
        handleOpen,
        handleClose,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
