"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// إنشاء الكونتكست
const MessageContext = createContext();

// ✅ Provider
export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);   // ✅ إضافة حالة للمستخدمين
  const [loading, setLoading] = useState(false);

  // جلب الرسائل من Supabase مباشرة (لو محتاج)
  const fetchMessages = async (userId = null) => {
    setLoading(true);
    const res = await fetch(`/api/messages${userId ? `?userId=${userId}` : ""}`);
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  // جلب المستخدمين مع الرسائل والتعليقات من الـ API
  const fetchUsersWithData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login"); // ✅ استدعاء الـ API اللي عملناه
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  // إرسال رسالة جديدة
  const sendMessage = async ({ user_id, content, sender_type }) => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, content, sender_type }),
    });
    const data = await res.json();

    if (data.error) {
      console.error("Error sending message:", data.error);
      return null;
    }

    setMessages((prev) => [...prev, data]);
    return data;
  };
console.log(users)
  return (
    <MessageContext.Provider
      value={{
        messages,
        users,              // ✅ نوفر المستخدمين هنا
        loading,
        fetchMessages,
        fetchUsersWithData, // ✅ دالة لجلب المستخدمين مع بياناتهم
        sendMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

// ✅ Hook للاستخدام في أي كومبوننت
export const useMessages = () => useContext(MessageContext);
