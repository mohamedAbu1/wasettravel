"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AdminChatMessages from "./components/AdminChatMessages";
import AdminChatInput from "./components/AdminChatInput";
import EgyptianBackground from "./EgyptianBackground";
import { useMessages } from "@/context/MessageContext";
import { FaTimes } from "react-icons/fa";
import { useChat } from "@/context/ChatContext";

export default function AdminChatWindow({ user, admin, messages, onClose }) {
  const { theme, themeName } = useTheme();
  const [text, setText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);

  const { setMessages, setActiveChatUserId } = useMessages();

  // ✅ تحديد المستخدم النشط
  useEffect(() => {
    setActiveChatUserId(user.id);
    return () => setActiveChatUserId(null);
  }, [user.id]);

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
          user_name: "Waset Travel",
          user_image:
            admin?.avatar_url || admin?.image || "/HomePageImage/apple-touch-icon.png",
          content: text,
          sender_type: "admin",
          status: "sent",
          admin_id: admin?.id || "SYSTEM", // ✅ قيمة افتراضية
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]); // ✅ أضف الرسالة مباشرة
      setText("");

      setText("");
    }
  };

  // ✅ إرسال صورة
  const handleSendImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);
    formData.append("user_name", "Waset Travel");
    formData.append(
      "user_image",
      admin?.avatar_url || admin?.image || "/default-avatar.png",
    );
    formData.append("sender_type", "admin");
    formData.append("admin_id", admin?.id || "SYSTEM");

    const res = await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.content) return;
    setMessages((prev) => [...prev, data]); // ✅ إضافة الرسالة محليًا
  };
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="admin-chat-panel fixed bottom-24 right-3 z-[89] flex h-[min(40rem,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] max-w-[27rem] flex-col overflow-hidden rounded-[1.5rem] border border-[#8f5d2e]/20 bg-[var(--surface)] text-[var(--foreground)] shadow-[0_1.5rem_4rem_rgba(32,24,17,.25)] sm:right-6"
        >
          <EgyptianBackground />

          <div className="flex items-center justify-between border-b border-[var(--line)] bg-[#30271d] px-4 py-3 text-[#f8f1e7]">
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
              className="grid h-9 w-9 place-items-center rounded-xl text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0b873]"
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
            messages={messages.filter((msg) => msg.user_id === user.id)}
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
            handleSendImage={handleSendImage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
