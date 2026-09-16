"use client";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const UsersSidebar = ({ users,userData, activeUser, setActiveUser, theme, themeName, markMessageSeen, messages }) => {
  const sameId = (left, right) => left != null && right != null && String(left) === String(right);
  // فلترة المستخدمين بحيث نستبعد الـ Admin
  const nonAdminUsers = users.filter(
    (user) => String(user?.role || "").trim().toLowerCase() !== "admin"
  );
console.log(users)
  return (
    <aside className="admin-message-sidebar">
      {/* العنوان */}
      <h3
        className="admin-message-sidebar__title"
      >
        Users
      </h3>

      {/* قائمة المستخدمين */}
      {nonAdminUsers.length > 0 ? (
        nonAdminUsers.map((user) => {
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
              onClick={() => {
                setActiveUser(user);
                // تحديث حالة الرسائل إلى "seen" عند فتح المحادثة
                messages
                  .filter((msg) => sameId(msg.user_id, user.id) && msg.status === "sent")
                  .forEach((msg) => markMessageSeen(msg.id));
              }}
              className={`admin-message-user
                ${
                  activeUser?.id === user.id
                    ? themeName === "dark"
                      ? "is-active"
                      : ""
                    : themeName === "dark"
                    ? ""
                    : ""
                }`}
            >
              {/* صورة المستخدم أو أيقونة افتراضية */}
              {user?.avatar_url ? (
                <img
                  src={user?.avatar_url}
                  alt={user.name}
                  className="admin-message-user__avatar"
                />
              ) : (
                  <FaUserCircle className="admin-message-user__avatar admin-message-user__avatar--fallback" />
              )}

              {/* الاسم */}
              <span className="admin-message-user__name">{user?.name}</span>

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
