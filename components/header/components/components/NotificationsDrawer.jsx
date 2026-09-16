"use client";
import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useNotifications } from "@/context/NotificationsContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

export default function NotificationsDrawer({
  open,
  onClose,
  themeName,
  handleNotificationClick,
  theme,
}) {
  const { notifications, deleteNotification } = useNotifications();
  const { t } = useTranslation("ui");

  const now = Date.now();
  const twoDays = 2 * 24 * 60 * 60 * 1000; // يومين بالمللي ثانية

  // ✅ فلترة وترتيب الإشعارات
  const filteredNotifications = notifications
    .filter((n) => n.event_type !== "message")
    .filter((n) => {
      const createdTime = new Date(n.created_at).getTime();
      return now - createdTime < twoDays; // احتفظ فقط بالإشعارات الأقل من يومين
    })
    .sort((a, b) => {
      // غير مقروءة أولاً
      if (Number(a.is_read) === 0 && Number(b.is_read) !== 0) return -1;
      if (Number(a.is_read) !== 0 && Number(b.is_read) === 0) return 1;
      // لو الاتنين نفس الحالة، رتب حسب التاريخ (الأحدث أولاً)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "left" }}
    >
      <div className="stone-drawer" style={{ "--drawer-bg": themeName === "dark" ? "#211d19" : "#fffaf3", "--drawer-text": themeName === "dark" ? "#f8f1e7" : "#30271d", "--drawer-muted": themeName === "dark" ? "rgba(248,241,231,.62)" : "#6f5c49", "--drawer-line": themeName === "dark" ? "rgba(224,184,115,.18)" : "rgba(112,69,31,.16)" }}>
        <div className="stone-drawer__header">
          <div className="flex items-center gap-3"><span className="stone-drawer__icon"><NotificationsNoneIcon /></span><div><Typography variant="h6" sx={{ fontWeight: 800, color: "var(--drawer-text)" }}>{t("notifications")}</Typography><Typography variant="caption" sx={{ color: "var(--drawer-muted)" }}>{filteredNotifications.length} {t("recentUpdates")}</Typography></div></div>
          <IconButton aria-label="Close notifications" onClick={onClose} sx={{ color: "var(--drawer-muted)" }}><CloseIcon /></IconButton>
        </div>
        <Divider sx={{ borderColor: "var(--drawer-line)" }} />
        <List sx={{ p: 0, mt: 2 }}>
          {!filteredNotifications.length && <div className="stone-drawer__empty"><NotificationsNoneIcon /><strong>{t("noNewNotifications")}</strong><span>{t("caughtUp")}</span></div>}
          {filteredNotifications.map((n) => (
            <Fade in={true} timeout={500} key={n.id}>
              <Box sx={{ mb: 1.5 }}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    alignItems: "flex-start",
                    backgroundColor:
                        Number(n.is_read) !== 0
                        ? "transparent"
                        : themeName === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(143,93,46,0.08)",
                    border: "1px solid var(--drawer-line)",
                    borderRadius: "16px",
                    padding: "14px",
                    boxShadow: Number(n.is_read) !== 0 ? "none" : "0 8px 20px rgba(78,54,31,.08)",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor:
                        themeName === "dark" ? "rgba(255,255,255,.08)" : "rgba(143,93,46,.12)",
                    },
                  }}
                >
                  {/* صورة المستخدم */}
                  <Avatar
                    src={n.user_image}
                    alt={n.user_name}
                    sx={{ width: 42, height: 42, mr: 1.5, border: "2px solid #8f5d2e" }}
                  />

                  {/* النصوص */}
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: Number(n.is_read) !== 0 ? 600 : 800,
                            textTransform: "capitalize",
                            color: "var(--drawer-text)",
                          }}
                        >
                          {n.user_name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            className="text-gradient"
                            sx={{
                              fontStyle: "italic",
                              fontWeight: 500,
                              color: "var(--drawer-muted)",
                            }}
                          >
                            {n.user_email}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                              color:"var(--drawer-text)"

                            }}
                          >
                            {n.message}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.5,
                              fontWeight: 400,
                              opacity: 0.8,
                              color:"var(--drawer-muted)"

                            }}
                          >
                            {new Date(n.created_at).toLocaleString("en-GB", {
                              timeZone: "Africa/Cairo",
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </Box>

                  {/* زر الحذف */}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteNotification(n.id)}
                    sx={{ color: themeName === "dark" ? "#ed9a8c" : "#a34e42", ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>

              </Box>
            </Fade>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
