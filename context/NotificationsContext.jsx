"use client";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // استدعاء API لجلب الإشعارات
  useEffect(() => {
    async function fetchNotifications() {
      console.log("📡 بدء جلب الإشعارات...");
      try {
        const res = await fetch("/api/notifications");
        console.log("📡 Response status:", res.status);
        const data = await res.json();
        console.log("📡 البيانات المستلمة:", data);

        if (data.success) {
          console.log("✅ تم تحديث الإشعارات في الحالة");
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("❌ خطأ في جلب الإشعارات:", err);
      } finally {
        setLoading(false);
        console.log("📡 انتهى الجلب، loading =", false);
      }
    }
    fetchNotifications();
  }, []); // ⚠️ مهم: لا تضع notifications هنا حتى لا يتكرر الاستدعاء بلا نهاية

  // تحديث حالة الإشعار إلى مقروء
  const markAsRead = async (id) => {
    console.log("✏️ تحديث الإشعار إلى مقروء:", id);
    try {
      await fetch(`/api/notifications/read/${id}`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      console.log("✅ تم تحديث الحالة محليًا");

      const res = await fetch("/api/notifications");
      const data = await res.json();
      console.log("📡 إعادة جلب للتأكد:", data);
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("❌ خطأ في تحديث الإشعار:", err);
    }
  };

  // حذف الإشعار
  const deleteNotification = async (id) => {
    console.log("🗑️ محاولة حذف الإشعار:", id);
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      const data = await res.json();
      console.log("📡 نتيجة الحذف:", data);

      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        console.log("✅ تم حذف الإشعار محليًا:", id);
      } else {
        console.error("❌ خطأ في حذف الإشعار:", data.error);
      }
    } catch (err) {
      console.error("❌ خطأ أثناء حذف الإشعار:", err.message);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, markAsRead, deleteNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook مخصص للوصول للإشعارات
export function useNotifications() {
  return useContext(NotificationsContext);
}
