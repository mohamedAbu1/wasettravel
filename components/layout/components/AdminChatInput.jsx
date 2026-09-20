"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaImage, FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";
<Picker onSelect={(emoji) => setNewMessage(newMessage + emoji.native)} />;

export default function AdminChatInput({
  text,
  setText,
  handleSend,
  themeName,
  handleSendImage,
  user,
}) {
const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const submitMessage = (event) => {
    event.preventDefault();
    if (!text?.trim()) return;
    handleSend();
  };

  return (
    <form className="conversation-input" onSubmit={submitMessage}>
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
        className="conversation-input__field"
      />
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="conversation-input__tool"
      >
        <FaSmile className="text-lg" />
      </button>
      {showEmojiPicker && (
        <div
          className="absolute right-30 bottom-25 z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
          style={{ width: "300px", height: "400px" }}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji) => setText(text + emoji.native)}
            theme={themeName === "dark" ? "dark" : "light"}
          />
        </div>
      )}

      <motion.button
        type="submit"
        style={{ cursor: "pointer" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="conversation-input__send"
      >
        <FaPaperPlane /> Send
      </motion.button>
    </form>
  );
}

