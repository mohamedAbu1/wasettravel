"use client";
import Drawer from '@mui/material/Drawer';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useNotifications } from "@/context/NotificationsContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CloseIcon from "@mui/icons-material/Close";

export default function MessagesDrawer({ open, onClose, themeName, theme, messageNotifications, handleMessageClick }) {
  const { deleteNotification } = useNotifications();

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
          <div className="flex items-center gap-3"><span className="stone-drawer__icon"><MailOutlineIcon /></span><div><Typography variant="h6" sx={{ fontWeight: 800, color: "var(--drawer-text)" }}>Messages</Typography><Typography variant="caption" sx={{ color: "var(--drawer-muted)" }}>{messageNotifications.length} conversations</Typography></div></div>
          <IconButton aria-label="Close messages" onClick={onClose} sx={{ color: "var(--drawer-muted)" }}><CloseIcon /></IconButton>
        </div>
        <Divider sx={{ borderColor: "var(--drawer-line)" }} />
        <List sx={{ p: 0, mt: 2 }}>
          {!messageNotifications.length && <div className="stone-drawer__empty"><MailOutlineIcon /><strong>No new messages</strong><span>Your inbox is clear.</span></div>}
          {messageNotifications.map((n) => (
            <Fade in={true} timeout={500} key={n.id}>
              <Box sx={{ mb: 1.5 }}>
                <ListItem
                  button
                  onClick={() => handleMessageClick(n)}
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
                      backgroundColor: themeName === "dark" ? "rgba(255,255,255,.08)" : "rgba(143,93,46,.12)",
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
                          {/* البريد الإلكتروني */}
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

                          {/* الرسالة */}
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

                          {/* التاريخ */}
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
