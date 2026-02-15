"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { decodeJwt } from "@/lib/utils/JWToken";
import { toast } from "react-toastify";
import { useQueryFilters } from "./QueryContext";
import { useRouter } from "next/navigation"; // ✅ لإدارة التنقل

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ من QueryContext
  const { updateValue,getEncodedQuery } = useQueryFilters();

  const saveToken = (token) => {
    localStorage.setItem("sb_access", token);
    document.cookie = `sb_access=${token}; path=/; max-age=${2 * 24 * 60 * 60}`;
  };

  const removeToken = () => {
    localStorage.removeItem("sb_access");
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

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        setUser(decoded);
        setIsLoggedIn(true);
        updateValue("id", decoded.id);
        updateValue("email", decoded.email);
        updateValue("role", decoded.role);
        updateValue("name", decoded.name);
        updateValue("avatar_url", decoded.avatar_url);
        updateValue("gender", decoded.gender);

        // ✅ بمجرد تسجيل الدخول أو تحميل التوكن، ضيف الكويري للـ URL
        const encodedQuery = getEncodedQuery();
        router.push(`/?data=${encodedQuery}`);
      } else {
        removeToken();
        setUser(null);
        setIsLoggedIn(false);
        setUserData(null);
      }
    }
  }, []);

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
      updateValue("id", decoded.id);
        updateValue("email", decoded.email);
        updateValue("role", decoded.role);
        updateValue("name", decoded.name);
        updateValue("avatar_url", decoded.avatar_url);
        updateValue("gender", decoded.gender);

      toast.success("✅ Account created successfully!");
      if (onSuccess) setOpen(false);

      // ✅ بعد التسجيل مباشرة ضيف الكويري للـ URL
      const encodedQuery = getEncodedQuery();
      router.push(`/?data=${encodedQuery}`);

      return decoded;
    } catch (err) {
      setError(err.message);
      toast.error("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true },
      );
      const data = res.data;

      if (!data.user || !data.token)
        throw new Error(data.error || "Login failed");

      saveToken(data.token);
      const decoded = decodeJwt(data.token);
      setUser(decoded);
      setIsLoggedIn(true);
     updateValue("id", decoded.id);
        updateValue("email", decoded.email);
        updateValue("role", decoded.role);
        updateValue("name", decoded.name);
        updateValue("avatar_url", decoded.avatar_url);
        updateValue("gender", decoded.gender);

      if (onSuccess) onSuccess();

      // ✅ بعد تسجيل الدخول مباشرة ضيف الكويري للـ URL
      const encodedQuery = getEncodedQuery();
      router.push(`/?data=${encodedQuery}`);

      return decoded;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Error clearing cookies on server:", err);
    }

    setUser(null);
    setIsLoggedIn(false);
    removeToken();
    setUserData(null);

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
