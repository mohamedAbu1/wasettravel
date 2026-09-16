"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";

const AuthContext = createContext(null);

const normalizeUser = (value) => value ? { ...value, role: String(value.role || "USER").toUpperCase(), avatar_url: value.avatar_url || value.image } : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me", { withCredentials: true });
      const nextUser = normalizeUser(response.data.user);
      if (!nextUser?.id) throw new Error("Invalid session");
      setUser(nextUser);
      return nextUser;
    } catch {
      try {
        const response = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        const nextUser = normalizeUser(response.data.user);
        if (!nextUser?.id) throw new Error("Invalid refreshed session");
        setUser(nextUser);
        return nextUser;
      } catch {
        setUser(null);
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      const nextUser = normalizeUser(response.data.user);
      if (!nextUser?.id) throw new Error(response.data.error || "Login failed");
      setUser(nextUser);
      onSuccess?.();
      return nextUser;
    } catch (requestError) {
      const message = requestError.response?.data?.error || requestError.message;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, gender, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/auth/register", { email, password, name, gender }, { withCredentials: true });
      const nextUser = normalizeUser(response.data.user);
      if (!nextUser?.id) throw new Error(response.data.error || "Registration failed");
      setUser(nextUser);
      toast.success("✅ Account created successfully!");
      onSuccess?.();
      return nextUser;
    } catch (requestError) {
      const message = requestError.response?.data?.error || requestError.message;
      setError(message);
      toast.error(`❌ Error: ${message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await axios.post("/api/auth/logout", {}, { withCredentials: true }); } catch (requestError) { console.error("Logout failed", requestError); }
    setUser(null);
    setError(null);
    if (session) await signOut({ redirect: false });
  };

  return <AuthContext.Provider value={{ userData: user || normalizeUser(session?.user), register, login, logout, loading, error, isLoggedIn: Boolean(user || session?.user), fetchUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
