/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // جلب رسائل المستخدم الحالي
const fetchMessages = async (userId) => {
  const res = await fetch(`/api/messages?userId=${userId}`);
  const data = await res.json();
  setMessages(Array.isArray(data) ? data : []);
};


  // إرسال رسالة جديدة
  const sendMessage = async ({
    user_id,
    user_name,
    user_image,
    content,
    sender_type,
  }) => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        user_name,
        user_image,
        content,
        sender_type,
        status: "sent", // ✅ حالة أولية عند الإرسال
      }),
    });
    const data = await res.json();

    if (!data.error) {
      setMessages((prev) => [...prev, data]);
    }
    return data;
  };

  // تحديث حالة الرسالة إلى "seen"
  const markMessageSeen = async (messageId) => {
    const res = await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    const data = await res.json();

    if (!data.error) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: "seen" } : msg))
      );
    }
    return data;
  };
useEffect(() => {
  if (user?.id) {
    fetchMessages(user.id); // يجلب مرة واحدة فقط
  }
}, [user,messages]);


  return (
    <MessageContext.Provider
      value={{ messages, loading, fetchMessages, sendMessage, markMessageSeen }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
