import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaDownload, FaExpand } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { saveAs } from "file-saver";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

export default function ChatMessages({ messages, userTyping, themeName }) {
  const handleDownload = async (url, id) => {
    const response = await fetch(url);
    const blob = await response.blob();
    // نحول الصورة لـ object URL
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // نحدد أبعاد الصورة
      canvas.width = img.width;
      canvas.height = img.height;

      // نرسم الصورة على الـ canvas
      ctx.drawImage(img, 0, 0);

      // نحولها لـ Blob بجودة محددة (0.7 = 70%)
      canvas.toBlob(
        (newBlob) => {
          saveAs(newBlob, `chat-image-${id}.jpg`);
        },
        "image/jpeg",
        0.7,
      );
    };
  };

  return (
    <div className="conversation-messages admin-chat-messages">
      <EgyptianBackground />
      <AnimatePresence>
        {messages.length > 0 ? (
          messages.map((msg) => (
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
              {/* ✅ صورة المرسل من قاعدة البيانات */}
              <img
                src={msg.user_image || "/default-avatar.png"}
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
                  {msg.sender_type === "admin" ? "👑 Admin" : msg.user_name}
                </p>

                {/* ✅ عرض الصور أو النصوص */}
                {typeof msg.content === "string" &&
                msg.content.startsWith("http") &&
                msg.content.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img
                    src={msg.content}
                    alt="message image"
                    className="rounded-lg shadow-md"
                  />
                ) : typeof msg.content === "string" &&
                  msg.content.startsWith("data:image/") ? (
                  <img
                    src={msg.content}
                    alt="message image"
                    className="rounded-lg shadow-md"
                  />
                ) : (
                  <p className="conversation-message-content">{msg.content || ""}</p>
                )}

                {/* ✅ وقت الإرسال وحالة الرسالة */}
                <div className="conversation-message-meta">
                  <FaClock className="text-xs opacity-70" />
                  <span className="text-xs italic opacity-70">
                    {msg.created_at
                      ? formatDistanceToNow(new Date(msg.created_at), {
                          addSuffix: true,
                        })
                      : ""}
                  </span>
                  {msg.status && (
                    <span className="conversation-message-status">
                      {msg.status === "sent" ? "✅ Sent" : "👀 Seen"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="admin-chat-empty">No messages yet. Start the conversation when you are ready.</p>
        )}
      </AnimatePresence>

      {userTyping && (
        <p className="admin-chat-typing">User is typing…</p>
      )}
    </div>
  );
}
