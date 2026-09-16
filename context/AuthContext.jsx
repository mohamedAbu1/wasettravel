"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryFilters } from "./QueryContext";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useData } from "./DataContext";

const AuthContext = createContext();

const normalizeUser = (value) => {
  if (!value || typeof value !== "object") return null;
  return {
    ...value,
    id: value.id || value.userId,
    role: String(value.role || "USER").toUpperCase(),
    avatar_url: value.avatar_url || value.image || value.avatar,
  };
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data: session } = useSession(); // ✅ جلب المستخدم من جوجل عبر NextAuth
  const [chatUser, setChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [user, setUser] = useState(null); // بيانات من API
  const [UserToken, setUserToken] = useState(null); // بيانات من التوكين
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleSignUpClose, handleLoginClose } = useData();
  const { getEncodedQuery } = useQueryFilters();

  const fetchUserFromServer = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const authenticatedUser = normalizeUser(res.data.user);
      if (!authenticatedUser?.id) throw new Error("Invalid session");
      setUser(authenticatedUser);
      setUserToken(authenticatedUser);
      setIsLoggedIn(Boolean(authenticatedUser));
      return authenticatedUser;
    } catch (err) {
      try {
        const retry = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const refreshedUser = normalizeUser(retry.data.user);
        if (!refreshedUser?.id) throw new Error("Invalid refreshed session");
        setUser(refreshedUser);
        setUserToken(refreshedUser);
        setIsLoggedIn(true);
        return refreshedUser;
      } catch (refreshErr) {
        if (refreshErr?.response?.status !== 401) {
          console.error("💥 Refresh failed:", refreshErr.message);
        }
        setUser(null);
        setUserToken(null);
        setIsLoggedIn(false);
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ استدعاء عند تحميل الصفحة
  useEffect(() => {
    fetchUserFromServer();
  }, []);

  // ✅ تسجيل مستخدم جديد يدويًا
  const register = async (email, password, name, gender) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/register",
        { name, email, password, gender },
        { withCredentials: true },
      );
      const data = res.data;
      if (res.status !== 201)
        throw new Error(data.error || "Registration failed");

      const registeredUser = normalizeUser(data.user);
      setUser(registeredUser);
      setUserToken(registeredUser);
      setIsLoggedIn(Boolean(registeredUser));
      toast.success("✅ Account created successfully!");
      handleSignUpClose();
      return registeredUser;
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Registration failed";
      setError(message);
      toast.error("❌ Error: " + message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول يدويًا
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

      if (res.status !== 200) {
        console.error("❌ فشل تسجيل الدخول:", data.error);
        throw new Error(data.error || "Login failed");
      }

      const authenticatedUser = normalizeUser(data.user);

      setUser(authenticatedUser);

      // ✅ جلب بيانات المستخدم من السيرفر بعد تسجيل الدخول
      await fetchUserFromServer();

      setIsLoggedIn(true);

      if (onSuccess) {
        onSuccess();
      }

      const encodedQuery = getEncodedQuery();
      const firstSegment = typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean)[0] : "en";
      const locale = ["en", "es", "fr", "de", "it", "zh"].includes(firstSegment) ? firstSegment : "en";
      router.push(`/${locale}?data=${encodedQuery}`);

      toast.success("✅ Logged in successfully!");
      return authenticatedUser;
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Login failed";
      setError(message);
      toast.error("❌ Error: " + message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول بجوجل
  const loginWithGoogle = async () => {
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        toast.error("❌ خطأ أثناء تسجيل الدخول بجوجل: " + result.error);
        return;
      }

      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      const userData = sessionData?.user;

      if (!userData) {
        toast.error("❌ لم يتم العثور على بيانات المستخدم.");
        return;
      }

      // ✅ استدعاء API route للتعامل مع MySQL
      const dbRes = await axios.post("/api/auth/google", {
        email: userData.email,
        name: userData.name,
      });

      const authenticatedUser = normalizeUser(dbRes.data.user || dbRes.data);
      setUser(authenticatedUser);
      setUserToken(authenticatedUser);
      setIsLoggedIn(Boolean(authenticatedUser));
      await fetchUserFromServer();
      handleLoginClose();
      toast.success("✅ تم تسجيل الدخول بجوجل!");
      return authenticatedUser;
    } catch (err) {
      console.error("OAuth Error:", err);
      toast.error("❌ حدث خطأ غير متوقع أثناء تسجيل الدخول بجوجل.");
    }
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Error clearing cookies on server:", err);
    }
    setUser(null);
    setUserToken(null);
    setIsLoggedIn(false);
    setChatUser(null);
    if (session) {
      await signOut({ redirect: false });
    }
    toast.info("🚪 Logged out successfully");
  };

  const userData = user || normalizeUser(session?.user);
  return (
    <AuthContext.Provider
      value={{
        userData, // بيانات من API أو من Google
        register,
        login,
        loginWithGoogle, // ✅ تسجيل الدخول بجوجل
        logout,
        loading,
        error,
        isLoggedIn,
        open,
        setOpen,
        handleOpen,
        handleClose,
        fetchUserFromServer,
        chatUser,
        setChatUser,
        chatMessages,
        setChatMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
