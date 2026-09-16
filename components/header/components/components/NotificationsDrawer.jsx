"use client";
import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { FaCalendarCheck, FaCommentDots, FaHeart, FaInfoCircle, FaShoppingBag, FaStar } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";
import { useTranslation } from "react-i18next";

const eventMeta = {
  purchase: { label: "New booking", icon: FaShoppingBag },
  review: { label: "New review", icon: FaStar },
  review_like: { label: "Review liked", icon: FaHeart },
  contact: { label: "Contact request", icon: FaCommentDots },
  cancellation: { label: "Cancellation", icon: FaCalendarCheck },
};

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Cairo" });
};

export default function NotificationsDrawer({ open, onClose, themeName, handleNotificationClick }) {
  const { notifications, deleteNotification } = useNotifications();
  const { t } = useTranslation("ui");
  const now = Date.now();
  const filteredNotifications = notifications
    .filter((notification) => notification.event_type !== "message")
    .filter((notification) => now - new Date(notification.created_at).getTime() < 2 * 24 * 60 * 60 * 1000)
    .sort((a, b) => Number(a.is_read) - Number(b.is_read) || new Date(b.created_at) - new Date(a.created_at));

  return (
    <Drawer anchor="right" open={open} onClose={onClose} TransitionComponent={Slide} TransitionProps={{ direction: "left" }}>
      <div className="stone-drawer stone-drawer--notifications" data-theme={themeName}>
        <header className="stone-drawer__header"><div className="stone-drawer__title-group"><span className="stone-drawer__icon"><NotificationsNoneIcon /></span><div><span className="stone-drawer__eyebrow">Activity center</span><h2>{t("notifications")}</h2><p><strong>{filteredNotifications.filter((item) => Number(item.is_read) === 0).length}</strong> unread · {filteredNotifications.length} recent updates</p></div></div><IconButton aria-label="Close notifications" onClick={onClose} className="stone-drawer__close"><CloseIcon /></IconButton></header>
        <div className="stone-drawer__list">
          {!filteredNotifications.length && <div className="stone-drawer__empty"><NotificationsNoneIcon /><strong>{t("noNewNotifications")}</strong><span>{t("caughtUp")}</span></div>}
          {filteredNotifications.map((notification) => {
            const meta = eventMeta[notification.event_type] || { label: "Account update", icon: FaInfoCircle };
            const EventIcon = meta.icon;
            const unread = Number(notification.is_read) === 0;
            return <article key={notification.id} className={`stone-notification-card ${unread ? "is-unread" : ""}`} onClick={() => handleNotificationClick(notification)} onKeyDown={(event) => event.key === "Enter" && handleNotificationClick(notification)} role="button" tabIndex={0}><div className="stone-notification-card__top"><span className="stone-notification-card__icon"><EventIcon /></span><div className="stone-notification-card__heading"><span>{meta.label}</span><strong>{notification.user_name || "WasetTravel"}</strong></div>{unread && <span className="stone-notification-card__badge">New</span>}<IconButton aria-label="Delete notification" className="stone-notification-card__delete" onClick={(event) => { event.stopPropagation(); deleteNotification(notification.id); }}><DeleteIcon /></IconButton></div>{notification.user_email && <p className="stone-notification-card__email">{notification.user_email}</p>}<p className="stone-notification-card__message">{notification.message || "You have a new activity update."}</p><footer className="stone-notification-card__footer"><time dateTime={notification.created_at}>{formatDate(notification.created_at)}</time>{notification.trip_id && <span>Trip #{String(notification.trip_id).slice(0, 8)}</span>}</footer></article>;
          })}
        </div>
      </div>
    </Drawer>
  );
}
