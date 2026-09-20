"use client";
import Typography from "@mui/material/Typography";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import { useMessages } from "@/context/MessageContext";
import NotificationsDrawer from "./components/NotificationsDrawer";
import MessagesDrawer from "./components/MessagesDrawer";

export default function RightBar() {
  const { userData, setChatUser } = useAuth();
  const { themeName, theme } = useTheme();
  const { t } = useTranslation("header");
  const { notifications, fetchNotifications, markAsRead } = useNotifications();
  const { fetchUserMessagesById, setMessages } = useMessages();
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const locale = ["en", "fr", "de", "it", "es", "pt", "zh"].includes(segments[0]) ? segments[0] : "en";
  const isAdmin = String(userData?.email || "").trim().toLowerCase() === "wasettraveleg@gmail.com";

  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;
  const twoDays = 2 * 24 * 60 * 60 * 1000;

  // ✅ إشعارات عامة (فلترة + ترتيب)
  const filteredNotifications = notifications
    .filter((n) => {
      const createdTime = new Date(n.created_at).getTime();
      return now - createdTime < twoDays; // إشعار أقل من يومين
    })
    .sort((a, b) => {
      if (Number(a.is_read) === 0 && Number(b.is_read) !== 0) return -1;
      if (Number(a.is_read) !== 0 && Number(b.is_read) === 0) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const unreadCount = filteredNotifications.filter(
    (n) => Number(n.is_read) === 0 && n.event_type !== "message",
  ).length;

  const [open, setOpen] = useState(false);

  // ✅ إشعارات الرسائل (فلترة + ترتيب)
  const messageNotifications = notifications
    .filter((n) => n.event_type === "message")
    .filter((n) => {
      if (n.is_read === 0) return true; // غير مقروءة تبقى
      const createdTime = new Date(n.created_at).getTime();
      return now - createdTime < twelveHours; // مقروءة لكن أقل من 12 ساعة
    })
    .sort((a, b) => {
      if (Number(a.is_read) === 0 && Number(b.is_read) !== 0) return -1;
      if (Number(a.is_read) !== 0 && Number(b.is_read) === 0) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const unreadMessages = messageNotifications.filter(
    (n) => Number(n.is_read) === 0,
  ).length;
  const [openMessages, setOpenMessages] = useState(false);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.event_type === "purchase" && notification.trip_id) {
      router.push(`/${locale}/trips/${notification.trip_id}`);
    }

    if (notification.event_type === "review" && notification.trip_id) {
      router.push(
        `/${locale}/trips/${notification.trip_id}?highlightReview=${notification.review_id}`,
      );
    }

    if (notification.event_type === "review_like" && notification.trip_id) {
      router.push(
        `/${locale}/trips/${notification.trip_id}?highlightReview=${notification.review_id}`,
      );
    }
  };

  const handleMessageClick = async (notification) => {
    await markAsRead(notification.id);
    setOpenMessages(false);

    setChatUser({
      id: notification.user_id,
      name: notification.user_name,
      image: notification.user_image,
    });

    const messages = await fetchUserMessagesById(notification.user_id);
    setMessages(messages);
  };

  return (
    <div className="hidden lg:flex items-center gap-4">
      {/* ✅ أيقونة الإشعارات العامة */}
      {isAdmin && (
        <Badge
          badgeContent={unreadCount}
          color="error"
          className="stone-header-action hidden lg:flex"
        >
          <NotificationsIcon
            aria-label={t("notifications")}
            title={t("notifications")}
            onClick={() => { setOpen(true); fetchNotifications(); }}
            sx={{
              cursor: "pointer",
              color: "var(--header-foreground)",
            }}
          />
        </Badge>
      )}

      {/* ✅ أيقونة الرسائل */}
      {isAdmin && (
        <Badge
          badgeContent={unreadMessages}
          color="error"
          className="stone-header-action hidden lg:flex"
        >
          <MailIcon
            aria-label={t("messages")}
            title={t("messages")}
            onClick={() => { setOpenMessages(true); fetchNotifications(); }}
            sx={{
              cursor: "pointer",
              color: "var(--header-foreground)",
            }}
          />
        </Badge>
      )}

      {/* Drawers */}
      <NotificationsDrawer
        open={open}
        onClose={() => setOpen(false)}
        themeName={themeName}
        theme={theme}
        handleNotificationClick={handleNotificationClick}
        notifications={filteredNotifications}
      />

      <MessagesDrawer
        open={openMessages}
        onClose={() => setOpenMessages(false)}
        themeName={themeName}
        theme={theme}
        messageNotifications={messageNotifications}
        handleMessageClick={handleMessageClick}
      />

      {userData && (
        <div className="hidden lg:flex items-center gap-2">
          <img
            alt={userData?.name || "User Avatar"}
            src={
              userData?.avatar_url || userData?.image || "/default-avatar.png"
            }
            width={40}
            height={40}
            style={{ border: "2px solid #d4af37", borderRadius: "50%" }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
              color: "var(--header-foreground)",
            }}
          >
            {userData?.name}
          </Typography>
        </div>
      )}
    </div>
  );
}
