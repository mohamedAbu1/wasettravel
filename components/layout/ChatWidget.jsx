"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useMessages } from "@/context/MessageContext";
import { FaComments } from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

export default function ChatWidget({ setShowEmojiPicker, showEmojiPicker }) {
  const [open, setOpen] = useState(false);
  const { theme, themeName } = useTheme();
  const { messages, sendMessage, fetchMessages, markMessageSeen } = useMessages();
  const [text, setText] = useState("");
  const { userData } = useAuth(); // ✅ بيانات من AuthContext
  const [adminTyping, setAdminTyping] = useState(false);

  const [bookingMode, setBookingMode] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // ✅ جلب رسائل المستخدم
  useEffect(() => {
    if (userData?.id) {
      fetchMessages(userData.id);
    }
  }, [userData]);

  // ✅ تحديث حالة الرسائل إلى "seen"
  useEffect(() => {
    if (userData?.id && messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.sender_type === "admin" && msg.status === "sent") {
          markMessageSeen(msg.id);
        }
      });
    }
  }, [userData, messages]);

  // ✅ استعلام حالة الكتابة للأدمن
  useEffect(() => {
    if (!userData?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${userData.id}`);
      const data = await res.json();
      setAdminTyping(data.adminTyping || false);
    }, 2000);
    return () => clearInterval(interval);
  }, [userData?.id]);

  const handleSend = async () => {
    if (text.trim() !== "") {
      await sendMessage({
        user_id: userData?.id,
        user_name: userData?.name,
        user_image: userData?.avatar_url || userData?.image || "/default-avatar.png",
        content: text,
        sender_type: "user",
        status: "sent",
      });
      setText("");
    }
  };

  const isAdmin = userData?.role === "ADMIN";

  const handleSendImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // ✅ لازم تبعت بيانات المستخدم مع الصورة
  formData.append("user_id", userData?.id);
  formData.append("user_name", userData?.name || "Unknown User");
  formData.append(
    "user_image",
    userData?.avatar_url || userData?.image || "/default-avatar.png"
  );
  formData.append("sender_type", "user");
  formData.append("admin_id", "SYSTEM"); // أو أي قيمة مناسبة

  const res = await fetch("/api/messages", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.url) return;

  // ✅ الرسالة الجديدة تدخل في الـ context
  await sendMessage({
    user_id: userData?.id,
    user_name: userData?.name,
    user_image: userData?.avatar_url || userData?.image || "/default-avatar.png",
    content: data.url, // الرابط النهائي للصورة
    sender_type: "user",
    status: "sent",
  });
};


  return (
    <>
      {!isAdmin && (
        <motion.button
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg flex items-center justify-center ${theme.buttonPrimary}`}
        >
          <FaComments size={22} color="#fff" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed overflow-x-hidden bottom-20 right-6 w-110 h-125 rounded-xl shadow-xl flex flex-col z-50 ${theme.card} ${theme.text}`}
          >
            <EgyptianBackground />
            <ChatHeader onClose={() => setOpen(false)} theme={theme} />
            <ChatMessages
              messages={messages}
              adminTyping={adminTyping}
              themeName={themeName}
            />

            {!bookingMode && (
              <ChatInput
                text={text}
                setText={setText}
                handleSend={handleSend}
                handleSendImage={handleSendImage}
                theme={theme}
                themeName={themeName}
                user={userData}
                setShowEmojiPicker={setShowEmojiPicker}
                showEmojiPicker={showEmojiPicker}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
