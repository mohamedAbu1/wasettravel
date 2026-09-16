"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();
const sameId = (left, right) => left != null && right != null && String(left) === String(right);
const isAdminRole = (role) => String(role || "").trim().toLowerCase() === "admin";

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const [open, setOpen] = useState(false);

  const [activeChatUserId, setActiveChatUserId] = useState(null);

  // ✅ جلب رسائل المستخدم الحالي
  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const endpoint = isAdminRole(userData?.role)
        ? "/api/messages"
        : `/api/messages?userId=${encodeURIComponent(userId)}`;
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Error fetching messages:", text);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setMessages((prev) => {
        const incoming = new Map(data.map((message) => [String(message.id), message]));
        const existing = prev.map((message) => incoming.get(String(message.id)) || message);
        const existingIds = new Set(existing.map((message) => String(message.id)));
        return [...existing, ...data.filter((message) => !existingIds.has(String(message.id)))];
      });
    } catch (err) {
      console.error("❌ Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserMessagesById = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/messages?userId=${encodeURIComponent(id)}`);
      if (!res.ok) {
        const text = await res.text();
        console.error("❌ خطأ في الاتصال بالسيرفر:", text);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data.filter((msg) => sameId(msg.user_id, id)) : [];
    } catch (err) {
      console.error("❌ خطأ أثناء جلب الرسائل:", err.message);
      return [];
    }
  }, []);

  // ✅ إرسال رسالة جديدة
  const sendMessage = async ({
    user_id,
    content,
    sender_type,
    status = "sent",
    reply_to = null,
    admin_id = isAdminRole(userData?.role) ? userData.id : "SYSTEM",
  }) => {
    const payload = {
      user_id,
      user_name: userData?.name || "Unknown User",
      user_image: userData?.avatar_url || userData?.image,
      content,
      sender_type,
      status,
      reply_to,
      admin_id,
    };

    // أضف الرسالة مباشرة للـ state علشان تظهر فورًا
    const tempMessage = {
      ...payload,
      id: Date.now(),
      status: "pending",
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error:", text);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, status: "error" } : msg,
          ),
        );
        return { error: text };
      }

      const data = await res.json();

      if (data.error) {
        console.error("❌ Error sending message:", data.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, status: "error" } : msg,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, ...data, status: "sent" }
              : msg,
          ),
        );
      }

      return data;
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      setMessages((prev) => prev.map((msg) => msg.id === tempMessage.id ? { ...msg, status: "error" } : msg));
      return { error: err.message };
    }
  };

  // ✅ تحديث حالة الرسالة إلى "seen"
  const markMessageSeen = async (messageId) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error:", text);
        return { error: text };
      }

      const data = await res.json();

      if (!data.error) {
        setMessages((prev) =>
          prev.map((msg) =>
            sameId(msg.id, messageId) ? { ...msg, status: "seen" } : msg,
          ),
        );
      } else {
        console.error("❌ Error marking message seen:", data.error);
      }

      return data;
    } catch (err) {
      console.error("❌ Error marking message seen:", err.message);
      return { error: err.message };
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchMessages(userData.id);
    }
  }, [userData?.id, userData?.role, open]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        fetchMessages,
        setMessages,
        sendMessage,
        markMessageSeen,
        fetchUserMessagesById,
        setActiveChatUserId,
        open,
        setOpen,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
