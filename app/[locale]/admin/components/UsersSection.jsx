"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { useUsers } from "../context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import UserCard from "./components/UserCard";
import UserActions from "./components/UserActions";
import UserDetails from "./components/UserDetails";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

const UsersSection = () => {
  const { users, fetchUsers } = useUsers();
  const { theme } = useTheme();
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const nonAdminUsers = users.filter(
    (user) => user.role?.toUpperCase() !== "ADMIN"
  );

  const handleToggle = (userId, tab) => {
    if (activeUser === userId && activeTab === tab) {
      setActiveUser(null);
      setActiveTab(null);
    } else {
      setActiveUser(userId);
      setActiveTab(tab);
    }
  };

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-lg ${theme.card} ${theme.text}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <EgyptianBackground />

      {/* ✅ العنوان وعدد المستخدمين */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <h2
          className={`text-2xl font-bold flex items-center gap-2 ${theme.textAccent}`}
        >
          <FaUsers /> Users Management
        </h2>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${theme.border}`}
        >
          <FaUsers />
          <span className="font-semibold">Total: {nonAdminUsers.length}</span>
        </div>
      </motion.div>

      <ul className={`mt-6 divide-y ${theme.border}`}>
        {nonAdminUsers.map((user) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`py-4 px-4`}
          >
            <UserCard user={user} />
            <UserActions user={user} handleToggle={handleToggle} />
            {activeUser === user.id && (
              <UserDetails user={user} activeTab={activeTab} />
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default UsersSection;
