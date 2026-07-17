"use client";
import Typography from "@mui/material/Typography";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import { useState } from "react";

export default function RightBar({ scrolled }) {
  const { userData } = useAuth();
  const { themeName } = useTheme();
  const { t } = useTranslation("header");
  const { notifications,markAsRead } = useNotifications();
  const router = useRouter();

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
      ["en", "fr", "de", "it", "es", "pt"].includes(segments[0]));

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;
  const [open, setOpen] = useState(false);

  // دالة عند الضغط على الإشعار
const handleNotificationClick = (notification) => {
  // تحديث حالة الإشعار إلى مقروء
  markAsRead(notification.id);

  // لو الإشعار شراء رحلة → تحويل للرحلة
  if (notification.event_type === "purchase" && notification.trip_id) {
    router.push(`/trips/${notification.trip_id}`);
  }

  // ✅ لو الإشعار خاص بتعليق (review)
  if (notification.event_type === "review" && notification.trip_id) {
    router.push(`/trips/${notification.trip_id}?highlightReview=${notification.review_id}`);
  }

  // ✅ لو الإشعار خاص بإعجاب على تعليق (review_like)
  if (notification.event_type === "review_like" && notification.trip_id) {
    router.push(`/trips/${notification.trip_id}?highlightReview=${notification.review_id}`);
  }
};



  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle scrolled={scrolled} />

      {/* Notifications Icon (only for Admins) */}
      {userData?.role === "ADMIN" && (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon
            onClick={() => setOpen(true)}
            sx={{
              cursor: "pointer",
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                  ? "#333"
                  : scrolled
                  ? "#333"
                  : "#fff",
            }}
          />
        </Badge>
      )}

      {/* Drawer for Notifications with animation */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "left" }}
      >
        <div
          style={{
            width: 400,
            padding: "16px",
            // backgroundColor: themeName === "dark" ? "#1e1e1e" : "#fafafa",
            color: themeName === "dark" ? "#fff" : "#333",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "600", color: themeName === "dark" ? "#fff" : "#333" }}
          >
            Notifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {notifications.map((n) => (
              <ListItem
                key={n.id}
                button
                onClick={() => handleNotificationClick(n)}
                sx={{
                  mb: 2,
                  alignItems: "flex-start",
                  backgroundColor: n.is_read === 1
                    ? "transparent"
                    : themeName === "dark"
                    ? "secondary.main"
                    : "info.main",
                  borderRadius: "8px",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: themeName === "dark" ? "#444" : "#eaeaea",
                  },
                }}
              >
                <img
                  src={n.user_image || "/default-avatar.png"}
                  alt={n.user_name}
                  width={50}
                  height={50}
                  style={{
                    borderRadius: "50%",
                    marginRight: "12px",
                    border: "2px solid #d4af37",
                  }}
                />
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: n.is_read ? "normal" : "bold", color: n.is_read && themeName === "dark" ? "#fff" : "#333", textTransform: "capitalize" }}
                    >
                      {n.user_name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {n.user_email}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.created_at).toLocaleString("en-GB", {
                          timeZone: "Africa/Cairo",
                        })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      {/* User Info */}
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
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                  ? "#333"
                  : scrolled
                  ? "#333"
                  : "#fff",
            }}
          >
            {userData?.name} ({userData?.role})
          </Typography>
        </div>
      )}
    </div>
  );
}
