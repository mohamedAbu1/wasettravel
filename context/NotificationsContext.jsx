"use client";
import { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch("/api/notifications", { credentials: "include", cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        }
      } catch (err) {
        console.error("خطأ في جلب الإشعارات:", err);
      } finally {
        if (!silent) setLoading(false);
      }
  };

  // تحديث حالة الإشعار إلى مقروء
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/read/${id}`, { method: "PUT" });
      if (!response.ok) return;
      // تحديث محلي
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)),
      );
      // إعادة جلب من السيرفر للتأكد
      await fetchNotifications(true);
    } catch (err) {
      console.error("خطأ في تحديث الإشعار:", err);
    }
  };
  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      const data = await res.json();

      if (data.success) {
        // تحديث محلي: إزالة الإشعار من القائمة
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        console.error("❌ خطأ في حذف الإشعار:", data.error);
      }
    } catch (err) {
      console.error("❌ خطأ أثناء حذف الإشعار:", err.message);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, fetchNotifications, markAsRead, deleteNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook مخصص للوصول للإشعارات
export function useNotifications() {
  return useContext(NotificationsContext);
}
