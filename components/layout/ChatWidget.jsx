"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useMessages } from "@/context/MessageContext";
import { FaComments } from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useChat } from "@/context/ChatContext";

export default function ChatWidget({ setShowEmojiPicker, showEmojiPicker }) {
  const { theme, themeName } = useTheme();
  const { messages, sendMessage, fetchMessages, markMessageSeen } = useMessages();
  const [text, setText] = useState("");
  const { userData } = useAuth();
  const { notifications, fetchNotifications, markAsRead } = useNotifications();
  const [adminTyping, setAdminTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const markedSeenRef = useRef(new Set());
  const isAdmin = String(userData?.role || "").trim().toLowerCase() === "admin" || String(userData?.email || "").trim().toLowerCase() === "wasettraveleg@gmail.com";
  const {
    open,
    bookingMode,
    from,
    setFrom,
    setOpen,
    to,
    setTo,
    setBookingMode,
    setMessageses,
    openChatWithCarBooking,
  } = useChat();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!userData?.id) return;
    fetchMessages(userData.id);
    if (!open) return;
    const interval = setInterval(() => fetchMessages(userData.id), 8000);
    return () => clearInterval(interval);
  }, [userData?.id, open]);

  useEffect(() => {
    if (!userData?.id || isAdmin) return undefined;
    fetchNotifications(true);
    const interval = window.setInterval(() => fetchNotifications(true), 10000);
    return () => window.clearInterval(interval);
  }, [userData?.id, userData?.role]);

  useEffect(() => {
    if (userData?.id && messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.sender_type === "admin" && msg.status === "sent" && !markedSeenRef.current.has(String(msg.id))) {
          markedSeenRef.current.add(String(msg.id));
          markMessageSeen(msg.id);
        }
      });
    }
  }, [userData, messages]);

  useEffect(() => {
    const handleCarBooking = () => openChatWithCarBooking();
    window.addEventListener("openCarBookingChat", handleCarBooking);
    return () => window.removeEventListener("openCarBookingChat", handleCarBooking);
  }, [openChatWithCarBooking]);

  useEffect(() => {
    if (!userData?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/typing?userId=${encodeURIComponent(userData.id)}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setAdminTyping(Boolean(data.adminTyping));
      } catch {
        // Typing indicators are best-effort and must never interrupt the chat.
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [userData?.id]);

  const handleSend = async (message = text) => {
    if (message.trim() !== "") {
      const result = await sendMessage({
        user_id: userData?.id,
        user_name: userData?.name,
        user_image: userData?.avatar_url || userData?.image || "/default-avatar.png",
        content: message,
        sender_type: "user",
        status: "sent",
      });
      if (!result?.error) setText("");
    }
  };

  const unreadAdminMessages = notifications.filter((notification) => notification.event_type === "message" && String(notification.user_id) === String(userData?.id) && Number(notification.is_read) === 0).length;

  const openChat = () => {
    setOpen((current) => !current);
    if (!open) {
      notifications.filter((notification) => notification.event_type === "message" && String(notification.user_id) === String(userData?.id) && Number(notification.is_read) === 0).forEach((notification) => markAsRead(notification.id));
    }
  };

  const handleSendImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userData?.id);
    formData.append("user_name", userData?.name || "Unknown User");
    formData.append("user_image", userData?.avatar_url || userData?.image || "/default-avatar.png");
    formData.append("sender_type", "user");
    formData.append("admin_id", "SYSTEM");

    const res = await fetch("/api/messages", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.content) return;
    await fetchMessages(userData.id);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {!isAdmin && (
        <motion.button
          style={{ cursor: "pointer" }}
          onClick={openChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat widget"
          className="fixed bottom-5 right-5 z-[90] grid h-14 w-14 place-items-center rounded-2xl border border-[#e0b873]/40 bg-[#8f5d2e] text-white shadow-[0_1rem_2.5rem_rgba(78,54,31,.28)] transition hover:-translate-y-1 hover:bg-[#6e4523] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8f5d2e]/30 sm:bottom-6 sm:right-6"
        >
          <FaComments size={22} color="#fff" />
          {unreadAdminMessages > 0 ? <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-[var(--background)] bg-[#b94a48] px-1 text-[.65rem] font-black text-white">{unreadAdminMessages > 9 ? "9+" : unreadAdminMessages}</span> : null}
        </motion.button>
      )}

      <AnimatePresence>
        {open && !isAdmin && (
          <motion.div
            role="dialog"
            aria-label="Chat window"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="chat-widget-panel fixed bottom-24 right-3 z-[89] flex h-[min(40rem,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] max-w-[27rem] flex-col overflow-hidden rounded-[1.5rem] border border-[#8f5d2e]/20 bg-[var(--surface)] text-[var(--foreground)] shadow-[0_1.5rem_4rem_rgba(32,24,17,.25)] sm:right-6"
          >
            <EgyptianBackground />
            <ChatHeader onClose={() => setOpen(false)} theme={theme} />
            <ChatMessages messages={messages} adminTyping={adminTyping} themeName={themeName} />

            {bookingMode ? (
              <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  🚗 Where would you like to book the car from and to?
                </p>

                <input
                  type="text"
                  placeholder="From"
                  aria-label="Car booking from location"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full mb-3 
                  focus:outline-none focus:ring-2 focus:ring-[#C2A878] dark:bg-gray-700 dark:text-white"
                />

                <input
                  type="text"
                  placeholder="To"
                  aria-label="Car booking to location"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full mb-3 
                  focus:outline-none focus:ring-2 focus:ring-[#C2A878] dark:bg-gray-700 dark:text-white"
                />

                <button
                  disabled={!from.trim() || !to.trim()}
                  onClick={async () => {
                    if (!from.trim() || !to.trim()) return;
                    const bookingMessage = `🚗 Car booking request from ${from} to ${to}`;
                    await handleSend(bookingMessage);
                    setMessageses((prev) => [
                      ...prev,
                      {
                        sender: "assistant",
                        content: "✅ Your request has been recorded. Please select the date and time.",
                      },
                    ]);
                    setBookingMode(false);
                  }}
                  aria-label="Confirm car booking request"
                  className="mt-4 w-full rounded-xl bg-[#8f5d2e] px-6 py-3 font-bold text-white shadow-md transition hover:bg-[#6e4523] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8f5d2e]/30"
                >
                  Confirm Booking
                </button>
              </div>
            ) : (
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
    </>,
    document.body,
  );
}
