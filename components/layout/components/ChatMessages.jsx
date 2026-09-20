"use client"
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { saveAs } from "file-saver";
import { FaClock, FaDownload, FaExpand, FaComments } from "react-icons/fa";
import { useEffect ,useRef} from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/lib/siteConfig";

export default function ChatMessages({ messages, adminTyping, themeName }) {
    const { t } = useTranslation("ui");
    const messagesEndRef = useRef(null);
   useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleDownload = async (url, id) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (newBlob) => {
          saveAs(newBlob, `chat-image-${id}.jpg`);
        },
        "image/jpeg",
        0.7
      );
    };
  };

  return (
    <div className="conversation-messages">
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
              <img
               src={
                  msg.sender_type === "admin" ? siteConfig.brandImage :
                  msg.user_image}
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
                  {msg.sender_type === "admin" ? `👑 ${siteConfig.name} 👑` : msg.user_name}
                </p>

                {msg.content.startsWith("http") &&
                msg.content.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <div className="relative group w-full max-w-xs">
                    <img
                      src={msg.content}
                      alt="uploaded"
                      className="w-full rounded-lg object-cover"
                    />
                    <div className="conversation-message-media-actions">
                      <button
                        onClick={() => handleDownload(msg.content, msg.id)}
                        className="conversation-message-media-action"
                      >
                        <FaDownload className="text-sm" /> Download
                      </button>
                      <button
                        onClick={() => window.open(msg.content, "_blank")}
                        className="conversation-message-media-action"
                      >
                        <FaExpand className="text-sm" /> View
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="conversation-message-content">{msg.content}</p>
                )}

                <div className="conversation-message-meta">
                  <FaClock className="text-xs" />
                  <span className="italic">
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
          <div className="conversation-empty">
            <FaComments />
            <p>{t("noMessagesYet")}</p>
            <span>{t("startConversation")}</span>
          </div>
        )}
      </AnimatePresence>

      {adminTyping && (
        <p className="text-xs italic opacity-70">{t("adminTyping")}</p>
      )}
    </div>
  );
}
