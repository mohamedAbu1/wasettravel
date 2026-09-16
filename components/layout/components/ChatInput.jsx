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
  themeName,
  user,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { t } = useTranslation("home");
    const { t: ui } = useTranslation("ui");

  return (
    <div className="conversation-input">
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
        placeholder={ui("typeMessage")}
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
        className="conversation-input__field"
      />
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        aria-label="Choose emoji"
        className="conversation-input__tool"
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
        className="conversation-input__send"
      >
        <FaPaperPlane /> {t("Send")}
      </motion.button>
    </div>
  );
}
