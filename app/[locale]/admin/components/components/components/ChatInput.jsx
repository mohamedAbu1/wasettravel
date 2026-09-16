/* eslint-disable react-hooks/rules-of-hooks */
import { FaPaperPlane, FaImage, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";

<Picker onSelect={(emoji) => setNewMessage(newMessage + emoji.native)} />;

export default function ChatInput({
  activeUser,
  newMessage,
  setNewMessage,
  handleSend,
  setIsTyping,
  handleSendImage,
}) {
  if (!activeUser) return null;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleSendImage(file); // ✅ نرسل الملف نفسه
  };

  return (
    <div className="admin-chat-input">
      <div className="admin-chat-input__row">
        {/* زر رفع صورة كأيقونة */}
        <label
          className="admin-chat-tool"
        >
          <FaImage className={`text-lg ${theme.icon}`} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {/* إدخال النص */}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            setIsTyping(e.target.value.length > 0);
            fetch("/api/typing", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: activeUser.id,
                adminTyping: e.target.value.length > 0,
              }),
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="admin-chat-textbox"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="admin-chat-tool"
        >
          <FaSmile className="text-lg" />
        </button>
        {showEmojiPicker && (
          <div className="mt-2">
            <Picker
              data={data}
              onEmojiSelect={(emoji) =>
                setNewMessage(newMessage + emoji.native)
              }
              theme={themeName === "dark" ? "dark" : "light"}
            />
          </div>
        )}
        {/* زر إرسال النص مع أيقونة */}
        <button
          onClick={handleSend}
          className="admin-chat-send"
        >
          <FaPaperPlane className="text-sm" /> Send
        </button>
      </div>
    </div>
  );
}
