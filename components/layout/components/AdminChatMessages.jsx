"use client";
import React, { useEffect,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaDownload, FaExpand, FaComments } from "react-icons/fa";

export default function AdminChatMessages({ messages, themeName }) {
    const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="conversation-messages">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`conversation-message-row ${
            msg.sender_type === "user"
              ? "conversation-message-row--incoming"
              : "conversation-message-row--outgoing"
          }`}
        >
          <img
            src={
              msg.sender_type === "admin"
                ? themeName === "dark"
                  ? "/HomePageImage/apple-touch-icon.png"
                  : "/HomePageImage/apple-touch-icon.png"
                : msg.user_image
            }
            alt={msg.user_name}
            className="conversation-message-avatar"
          />
          <div
            className={`conversation-message-bubble ${
              msg.sender_type === "user"
                ? "conversation-message-bubble--incoming"
                : "conversation-message-bubble--outgoing"
            }`}
          >
            <p className="conversation-message-sender">
              {msg.sender_type === "admin"
                ? "👑 Waset Travel 👑"
                : msg.user_name || "Waset Travel"}
            </p>

            {msg.content.startsWith("https") ? (
              <img
                src={msg.content}
                alt="uploaded"
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <p className="conversation-message-content">{msg.content}</p>
            )}

            <div className="conversation-message-meta">
              <FaClock className="text-xs" />
              {/* <span className="italic">
                    {msg.created_at
                      ? formatDistanceToNow(new Date(msg.created_at), {
                          addSuffix: true,
                        })
                      : ""}
                  </span> */}
              {msg.status && (
                <span className="conversation-message-status">
                  {msg.status === "sent" ? "✅ Sent" : "👀 Seen"}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
