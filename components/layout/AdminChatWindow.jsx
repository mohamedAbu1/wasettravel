"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AdminChatMessages from "./components/AdminChatMessages";
import AdminChatInput from "./components/AdminChatInput";
import EgyptianBackground from "./EgyptianBackground";
import { useMessages } from "@/context/MessageContext";
import { FaTimes } from "react-icons/fa";
import { useChat } from "@/context/ChatContext";
import { siteConfig } from "@/lib/siteConfig";

export default function AdminChatWindow({ user, admin, messages, onClose }) {
  const { theme, themeName } = useTheme();
  const [text, setText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { setMessages, setActiveChatUserId, fetchUserMessagesById } = useMessages();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ✅ تحديد المستخدم النشط
  useEffect(() => {
    setActiveChatUserId(user.id);
    return () => setActiveChatUserId(null);
  }, [user.id]);

  // Keep an open conversation live. Closed conversations are handled by the
  // notification polling, while this window refreshes only the active user.
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const syncConversation = async () => {
      const nextMessages = await fetchUserMessagesById(user.id);
      if (!cancelled && Array.isArray(nextMessages)) setMessages(nextMessages);
    };
    syncConversation();
    const interval = window.setInterval(syncConversation, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user?.id, fetchUserMessagesById, setMessages]);

  // ✅ استعلام حالة الكتابة للأدمن
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${user.id}`);
      const data = await res.json();
      setAdminTyping(data.adminTyping || false);
    }, 2000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // ✅ إرسال رسالة نصية
  const handleSend = async () => {
    if (text.trim() !== "") {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          user_name: siteConfig.name,
          user_image: siteConfig.brandImage,
          content: text,
          sender_type: "admin",
          status: "sent",
          admin_id: admin?.id || "SYSTEM", // ✅ قيمة افتراضية
        }),
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        console.error("Unable to send admin message:", data?.error || res.statusText);
        return;
      }
      setMessages((prev) => [...prev, data]);
      setText("");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {user && (
        <motion.div
          className="admin-chat-panel admin-chat-panel--external fixed bottom-24 right-3 z-[89] flex h-[min(40rem,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] max-w-[27rem] flex-col overflow-hidden rounded-[1.5rem] border border-[#8f5d2e]/20 bg-[var(--surface)] text-[var(--foreground)] shadow-[0_1.5rem_4rem_rgba(32,24,17,.25)] sm:right-6"
        >
          <EgyptianBackground />

          <div className="conversation-header">
            <div className="flex items-center gap-2">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%", border: "2px solid #e0b873" }}
              />
              <span className="font-bold capitalize">{user.name}</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close admin chat"
              className="conversation-close-button"
            >
              <motion.div
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTimes size={22} />
              </motion.div>
            </button>
          </div>

          <AdminChatMessages
            messages={messages.filter((msg) => String(msg.user_id) === String(user.id))}
            themeName={themeName}
            adminTyping={adminTyping}
          />

          <AdminChatInput
            text={text}
            setText={setText}
            handleSend={handleSend}
            theme={theme}
            themeName={themeName}
            user={user}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
