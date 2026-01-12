"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useMessages } from "@/context/MessageContext"; // ✅ استدعاء الكونتكست
import { FaComments, FaPaperPlane, FaImage } from "react-icons/fa";
import EgyptianBackground from "@/components/trips/EgyptianBackground";
import { useAuth } from "@/context/AuthContext";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { themeName, theme } = useTheme();
  const { messages, sendMessage } = useMessages(); // ✅ استخدام الكونتكست
  const [text, setText] = useState("");
  const { user } = useAuth();

  const chatVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const handleSend = () => {
    if (text.trim() !== "") {
      sendMessage({ user_id: user.id, content: text, sender_type: "user" });
      setText("");
    }
  };

  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      sendMessage({
        user_id: "currentUserId",
        content: imageUrl,
        sender_type: "user",
      });
    }
  };

  return (
    <>
      {/* زر فتح الدردشة */}
      <motion.button
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg flex items-center justify-center ${theme.buttonPrimary}`}
      >
        <FaComments size={22} />
      </motion.button>

      {/* نافذة الدردشة */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            className={`fixed bottom-20 right-6 w-96 h-125 rounded-xl shadow-xl flex flex-col ${theme.card} ${theme.text}`}
          >
            <EgyptianBackground />
            {/* الهيدر */}
            <div
              className={`font-bold p-3 rounded-t-xl flex justify-between items-center ${theme.buttonPrimary}`}
            >
              <span>MyWebsite Support</span>
              <button
                onClick={() => setOpen(false)}
                style={{ cursor: "pointer" }}
                className="font-bold"
              >
                ✖
              </button>
            </div>

            {/* الرسائل */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  variants={messageVariants}
                  className={`p-2 rounded max-w-[70%] ${
                    msg.sender_type === "user"
                      ? theme.buttonPrimary
                      : theme.card
                  }`}
                >
                  {msg.content.startsWith("blob:") ? (
                    <img
                      src={msg.content}
                      alt="sent"
                      className="rounded max-h-40"
                    />
                  ) : (
                    msg.content
                  )}
                </motion.div>
              ))}
            </div>

            {/* الإدخال */}
            <div
              className={`p-3 border-t flex gap-2 items-center ${theme.border}`}
            >
              <label className="cursor-pointer">
                <FaImage size={20} className={theme.icon} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSendImage}
                />
              </label>
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`flex-1 rounded px-2 py-1 border ${theme.border}`}
              />
              <motion.button
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className={`${theme.buttonPrimary} flex items-center gap-1`}
              >
                <FaPaperPlane /> Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
