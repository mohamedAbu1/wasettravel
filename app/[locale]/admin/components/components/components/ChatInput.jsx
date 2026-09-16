"use client";

import { FaPaperPlane, FaImage, FaSmile, FaTimes } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useEffect, useRef, useState } from "react";

export default function ChatInput({
  activeUser,
  newMessage,
  setNewMessage,
  handleSend,
  setIsTyping,
  handleSendImage,
  themeName,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const typingTimer = useRef(null);
  const emojiPanel = useRef(null);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  useEffect(() => {
    const closePicker = (event) => {
      if (emojiPanel.current && !emojiPanel.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", closePicker);
    return () => document.removeEventListener("mousedown", closePicker);
  }, []);

  if (!activeUser) return null;

  const notifyTyping = (value) => {
    const isTyping = value.trim().length > 0;
    setIsTyping(isTyping);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: activeUser.id, adminTyping: isTyping }),
      }).catch(() => {});
    }, 250);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      await handleSendImage(file);
    } finally {
      setUploading(false);
    }
  };

  const submitMessage = (event) => {
    event.preventDefault();
    if (!newMessage?.trim() || uploading) return;
    handleSend();
  };

  return (
    <form className="admin-chat-input" onSubmit={submitMessage}>
      <div className="admin-chat-input__composer">
        <div className="admin-chat-input__row">
          <label className="admin-chat-tool" title="Attach an image">
            <FaImage aria-hidden="true" />
            <span className="sr-only">Attach an image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>

          <textarea
            rows={1}
            value={newMessage}
            placeholder="Write a thoughtful reply…"
            aria-label="Message text"
            className="admin-chat-textbox"
            onChange={(event) => {
              setNewMessage(event.target.value);
              notifyTyping(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitMessage(event);
              }
            }}
          />

          <div className="admin-chat-emoji-wrap" ref={emojiPanel}>
            <button
              type="button"
              className={`admin-chat-tool ${showEmojiPicker ? "is-active" : ""}`}
              onClick={() => setShowEmojiPicker((visible) => !visible)}
              aria-label="Choose an emoji"
              aria-expanded={showEmojiPicker}
            >
              <FaSmile aria-hidden="true" />
            </button>
            {showEmojiPicker ? (
              <div className="admin-chat-emoji-picker">
                <button type="button" className="admin-chat-emoji-close" onClick={() => setShowEmojiPicker(false)} aria-label="Close emoji picker">
                  <FaTimes />
                </button>
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => setNewMessage((current) => `${current}${emoji.native}`)}
                  theme={themeName === "dark" ? "dark" : "light"}
                  previewPosition="none"
                  skinTonePosition="none"
                />
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="admin-chat-send"
            disabled={!newMessage?.trim() || uploading}
          >
            <FaPaperPlane aria-hidden="true" />
            <span>{uploading ? "Uploading…" : "Send"}</span>
          </button>
        </div>
        <div className="admin-chat-input__footer">
          <span>{activeUser.name ? `Replying to ${activeUser.name}` : "Private reply"}</span>
          <span>Enter to send · Shift + Enter for a new line</span>
        </div>
      </div>
    </form>
  );
}
