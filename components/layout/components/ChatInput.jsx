"use client";
import { motion } from "framer-motion";
import { FaImage, FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";
import { useTranslation } from "react-i18next";
<Picker onSelect={(emoji) => setNewMessage(newMessage + emoji.native)} />;

export default function ChatInput({
  text,
  setText,
  handleSend,
  handleSendImage,
  theme,
  themeName,
  user,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { t } = useTranslation("home");

  return (
    <div className="relative flex items-center gap-2 border-t border-[var(--line)] bg-[var(--surface-raised)] p-3">
      {/* <label className="cursor-pointer">
        <FaImage size={20} className={theme.icon} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => { const file = e.target.files[0]; if (file) { handleSendImage(file); } }}
          className="hidden"
        />
      </label> */}
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          fetch("/api/typing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              isTyping: e.target.value.length > 0,
            }),
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        aria-label="Type your message"
        className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[#8f5d2e] focus:ring-2 focus:ring-[#8f5d2e]/20"
      />
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        aria-label="Choose emoji"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
          themeName === "dark"
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
      >
        <FaSmile className="text-lg" />
      </button>
      {showEmojiPicker && (
        <div
          className="absolute bottom-16 right-2 z-50 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-2xl"
          style={{ width: "min(300px, calc(100vw - 2rem))", height: "min(400px, 55dvh)" }}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji) => setText(text + emoji.native)}
            theme={themeName === "dark" ? "dark" : "light"}
          />
        </div>
      )}

      <motion.button
        style={{ cursor: "pointer" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        aria-label="Send message"
        className={`${theme.buttonPrimary} flex h-10 shrink-0 items-center gap-1 rounded-xl px-3 text-white`}
      >
        <FaPaperPlane /> {t("Send")}
      </motion.button>
    </div>
  );
}
