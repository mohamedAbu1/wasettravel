/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserShield, FaSyncAlt } from "react-icons/fa";
import { useUsers } from "../context/UserContext";
import UserActions from "./components/UserActions";
import UserDetails from "./components/UserDetails";

const UsersSection = () => {
  const { users = [], fetchUsers, setUsers, loading, error } = useUsers();
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    fetchUsers();
    const interval = window.setInterval(fetchUsers, 15000);
    return () => window.clearInterval(interval);
  }, [fetchUsers]);

  const handleToggle = (userId, tab) => {
    if (activeUser === userId && activeTab === tab) {
      setActiveUser(null);
      setActiveTab(null);
    } else {
      setActiveUser(userId);
      setActiveTab(tab);
    }
  };

  // ✅ تغيير الدور (USER ⇄ ADMIN)
  const handleToggleRole = async (user) => {
    const newRole = String(user?.role || "").trim().toLowerCase() === "admin" ? "USER" : "ADMIN";

    const res = await fetch("/api/updateRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, newRole }),
    });

    if (!res.ok) {
      console.error("❌ Server error:", res.status);
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return;
    }

    if (data.error) {
      console.error("❌ Error updating role:", data.error);
    } else {

      // ✅ تحديث محلي سريع باستخدام العمود role مباشرة
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, role: data.role } : u
        )
      );

      // ✅ إعادة تحميل للتأكد من التزامن مع قاعدة البيانات
      fetchUsers();
    }
  };

  return (
    <motion.div
      className="admin-panel admin-section-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="admin-section-header"
      >
        <div><p className="admin-section-eyebrow">People & access</p><h2 className="admin-section-title">Users management</h2><p className="admin-section-description">Review profiles, activity and access levels from one place.</p></div>
        <div className="admin-section-metric">
          <FaUsers />
          <span><strong>{users.length}</strong><small>Registered users</small></span>
        </div>
      </motion.div>

      <div className="admin-user-toolbar"><span><FaUserShield /> Access control</span><button type="button" className="admin-action-button" onClick={fetchUsers} disabled={loading}><FaSyncAlt /> {loading ? "Refreshing…" : "Refresh users"}</button></div>
      {error && <p className="admin-empty-state admin-empty-state--error" role="alert">{error}</p>}
      {!loading && !error && users.length === 0 ? <p className="admin-empty-state">No users found.</p> : <ul className="admin-user-grid">
        {users.map((user) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="admin-user-card"
          >
            {/* ✅ صورة المستخدم */}
            <img
              src={user?.avatar_url || "/default-avatar.png"}
              alt={user?.name || "User"}
              className="admin-user-card__avatar"
            />

            <div className="admin-user-card__identity">
              {/* ✅ عرض الاسم والإيميل */}
              <p className="admin-user-card__name">{user?.name || "Unknown user"}</p>
              <p className="admin-user-card__email">{user?.email || "No email"}</p>

              {/* ✅ عرض الدور الحالي */}
              <span className="admin-status-pill">{user?.role || "USER"}</span>

              {/* ✅ زر لتغيير الدور */}
              <button
                onClick={() => handleToggleRole(user)}
                className="admin-action-button admin-action-button--small mt-3"
              >
                {String(user?.role || "").trim().toLowerCase() === "admin" ? "Make user" : "Make admin"}
              </button>
            </div>

            <div className="admin-user-card__body"><UserActions user={user} handleToggle={handleToggle} />{activeUser === user.id && <UserDetails user={user} activeTab={activeTab} />}</div>
          </motion.li>
        ))}
      </ul>}
    </motion.div>
  );
};

export default UsersSection;
