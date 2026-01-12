"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function MessagesPage() {
  const { theme, themeName } = useTheme();

  // ✅ مستخدمين وهميين
  const [users] = useState([
    { id: 1, name: "Mohamed Ali", avatar: "/avatars/mohamed.png", hasNew: true },
    { id: 2, name: "Sara Ahmed", avatar: "/avatars/sara.png", hasNew: false },
    { id: 3, name: "Omar Khaled", avatar: "/avatars/omar.png", hasNew: true },
    { id: 4, name: "Nour Hassan", avatar: "/avatars/nour.png", hasNew: false },
  ]);

  const [activeUser, setActiveUser] = useState(users[0]);

  // ✅ رسائل تجريبية
  const [messages, setMessages] = useState([
    { id: 1, sender: "Mohamed Ali", content: "Hello, I need help with my booking." },
    { id: 2, sender: "Support", content: "Sure! Can you share your booking ID?" },
  ]);

  return (
    <main className={`flex h-[99%] ${theme.background} ${theme.text}`}>
      {/* Sidebar للمستخدمين */}
      <aside className={`w-72 border-r ${theme.border} p-4 space-y-4`}>
        <h3 className={`${theme.title} mb-4`}>Users</h3>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setActiveUser(user)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
              activeUser?.id === user.id
                ? themeName === "dark"
                  ? "bg-gold text-black"
                  : "bg-yellow-500 text-white"
                : ""
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border"
            />
            <span className="flex-1">{user.name}</span>
            {user.hasNew && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>
        ))}
      </aside>

      {/* منطقة المحادثة */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`p-3 border-b ${theme.border} font-bold`}>
          {activeUser ? `Chat with ${activeUser.name}` : "Select a user"}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg max-w-[70%] ${
                msg.sender === activeUser?.name
                  ? themeName === "dark"
                    ? "bg-gray-700 text-white self-start"
                    : "bg-gray-200 text-black self-start"
                  : themeName === "dark"
                    ? "bg-gold text-black self-end"
                    : "bg-yellow-500 text-white self-end"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        {activeUser && (
          <div className={`p-3 border-t ${theme.border} flex gap-2`}>
            <input
              type="text"
              placeholder="Type a message..."
              className={`flex-1 rounded px-2 py-1 border ${theme.border}`}
            />
            <button className={`${theme.buttonPrimary}`}>Send</button>
          </div>
        )}
      </section>
    </main>
  );
}
