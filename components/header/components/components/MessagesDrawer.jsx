"use client";
import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { FaCommentDots } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";
import { useTranslation } from "react-i18next";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Cairo" });
};

export default function MessagesDrawer({ open, onClose, themeName, messageNotifications = [], handleMessageClick }) {
  const { deleteNotification } = useNotifications();
  const { t } = useTranslation("ui");
  return <Drawer anchor="right" open={open} onClose={onClose} TransitionComponent={Slide} TransitionProps={{ direction: "left" }}><div className="stone-drawer stone-drawer--messages" data-theme={themeName}><header className="stone-drawer__header"><div className="stone-drawer__title-group"><span className="stone-drawer__icon"><MailOutlineIcon /></span><div><span className="stone-drawer__eyebrow">Guest inbox</span><h2>{t("messages")}</h2><p><strong>{messageNotifications.filter((item) => Number(item.is_read) === 0).length}</strong> unread · {messageNotifications.length} conversations</p></div></div><IconButton aria-label="Close messages" onClick={onClose} className="stone-drawer__close"><CloseIcon /></IconButton></header><div className="stone-drawer__list">{!messageNotifications.length && <div className="stone-drawer__empty"><MailOutlineIcon /><strong>{t("noNewMessages")}</strong><span>{t("inboxClear")}</span></div>}{messageNotifications.map((notification) => { const unread = Number(notification.is_read) === 0; return <article key={notification.id} className={`stone-notification-card stone-message-card ${unread ? "is-unread" : ""}`} onClick={() => handleMessageClick(notification)} onKeyDown={(event) => event.key === "Enter" && handleMessageClick(notification)} role="button" tabIndex={0}><div className="stone-notification-card__top"><span className="stone-notification-card__icon"><FaCommentDots /></span><div className="stone-notification-card__heading"><span>New message</span><strong>{notification.user_name || "Guest"}</strong></div>{unread && <span className="stone-notification-card__badge">New</span>}<IconButton aria-label="Delete message notification" className="stone-notification-card__delete" onClick={(event) => { event.stopPropagation(); deleteNotification(notification.id); }}><DeleteIcon /></IconButton></div>{notification.user_email && <p className="stone-notification-card__email">{notification.user_email}</p>}<p className="stone-notification-card__message">{notification.message || "A guest sent you a new message."}</p><footer className="stone-notification-card__footer"><time dateTime={notification.created_at}>{formatDate(notification.created_at)}</time><span>Open conversation <b>→</b></span></footer></article>; })}</div></div></Drawer>;
}
