"use client";
import React, { useMemo, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const UsersSidebar = ({ users = [], activeUser, setActiveUser, messages = [] }) => {
  const [query, setQuery] = useState("");
  const sameId = (left, right) => left != null && right != null && String(left) === String(right);
  // فلترة المستخدمين بحيث نستبعد الـ Admin
  const nonAdminUsers = users.filter(
    (user) => String(user?.role || "").trim().toLowerCase() !== "admin"
  );
  const visibleUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...nonAdminUsers]
      .filter((user) => !normalizedQuery || `${user?.name || ""} ${user?.email || ""}`.toLowerCase().includes(normalizedQuery))
      .sort((left, right) => {
        const leftUnread = messages.filter((message) => sameId(message.user_id, left.id) && message.sender_type === "user" && message.status === "sent").length;
        const rightUnread = messages.filter((message) => sameId(message.user_id, right.id) && message.sender_type === "user" && message.status === "sent").length;
        return rightUnread - leftUnread;
      });
  }, [messages, nonAdminUsers, query]);
  return (
    <aside className="admin-message-sidebar">
      {/* العنوان */}
      <h3
        className="admin-message-sidebar__title"
      >
        Users
      </h3>

      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users…" aria-label="Search users" className="admin-message-search" />
      {visibleUsers.length > 0 ? (
        visibleUsers.map((user) => {
          // عدد الرسائل الجديدة غير المقروءة
          const unreadCount = messages.filter(
            (msg) =>
              sameId(msg.user_id, user.id) &&
              msg.sender_type === "user" &&
              msg.status === "sent"
          ).length;

          return (
            <div
              key={user.id}
              onClick={() => setActiveUser(user)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setActiveUser(user); }}
              role="button"
              tabIndex={0}
              aria-current={sameId(activeUser?.id, user.id) ? "true" : undefined}
              className={`admin-message-user ${sameId(activeUser?.id, user.id) ? "is-active" : ""}`}
            >
              {/* صورة المستخدم أو أيقونة افتراضية */}
              {user?.avatar_url || user?.image ? (
                <img
                  src={user?.avatar_url || user?.image}
                  alt={user.name}
                  className="admin-message-user__avatar"
                />
              ) : (
                  <FaUserCircle className="admin-message-user__avatar admin-message-user__avatar--fallback" />
              )}

              {/* الاسم */}
              <span className="admin-message-user__details"><span className="admin-message-user__name">{user?.name || user?.email || "Guest"}</span><small>{user?.email || ""}</small></span>

              {/* Badge لو فيه رسائل جديدة */}
              {unreadCount > 0 && (
                <span className="admin-unread-badge">
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-sm opacity-70">No non-admin users available.</p>
      )}
    </aside>
  );
};

export default UsersSidebar;
