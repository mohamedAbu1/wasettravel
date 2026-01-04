import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaUserShield, FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UsersList() {
  const { themeName } = useTheme();

  const users = [
    { name: "Ahmed Ali", email: "ahmed@example.com", role: "Admin", status: "Active" },
    { name: "Sara Mohamed", email: "sara@example.com", role: "User", status: "Inactive" },
    { name: "Omar Hassan", email: "omar@example.com", role: "Moderator", status: "Active" },
  ];

  return (
    <div
      className={`rounded-xl shadow-lg p-6 ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          themeName === "dark"
            ? "text-gold"
            : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
        }`}
      >
        Users
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className={`${
              themeName === "dark"
                ? "bg-gold/20 text-gold"
                : "bg-[#fdf6e3] text-[#3a2c0a]"
            }`}
          >
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={i}
              className={`transition hover:scale-[1.01] ${
                themeName === "dark"
                  ? "hover:bg-gold/10"
                  : "hover:bg-[#fdf6e3]/50"
              }`}
            >
              <td className="p-3 flex items-center gap-2">
                <FaUser /> {user.name}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 flex items-center gap-2">
                {user.role === "Admin" ? (
                  <FaUserShield className="text-red-500" />
                ) : (
                  <FaUser className="text-blue-500" />
                )}
                {user.role}
              </td>
              <td className="p-3 flex items-center gap-2">
                {user.status === "Active" ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                {user.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
