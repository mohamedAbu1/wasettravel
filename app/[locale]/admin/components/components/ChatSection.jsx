/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useMessages } from "@/context/MessageContext";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { siteConfig } from "@/lib/siteConfig";

const ChatSection = ({ activeUser, theme, themeName }) => {
  const { messages, setMessages, sendMessage, markMessageSeen } = useMessages();
  const { userData } = useAuth(); // الأدمن الحالي من التوكين
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const markedSeenRef = useRef(new Set());

  const activeMessages = useMemo(
    () => activeUser
      ? messages.filter((message) => String(message.user_id) === String(activeUser.id))
      : [],
    [activeUser, messages],
  );

  // ✅ تحديث حالة الرسائل إلى "seen"
  useEffect(() => {
    if (activeUser && activeMessages.length > 0) {
      activeMessages.forEach((msg) => {
        if (
          msg.sender_type === "user" &&
          msg.status === "sent" &&
          !markedSeenRef.current.has(String(msg.id))
        ) {
          markedSeenRef.current.add(String(msg.id));
          markMessageSeen(msg.id);
        }
      });
    }
  }, [activeUser, activeMessages, markMessageSeen]);

  const handleSend = async () => {
    if (!activeUser || !userData?.id || !newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    setIsSending(true);
    setSendError("");
    try {
      const result = await sendMessage({
        user_id: activeUser.id,
        user_name: siteConfig.name,
        user_image: siteConfig.brandImage,
        content,
        sender_type: "admin",
        reply_to: replyTo ? replyTo.id : null,
        admin_id: userData.id,
        status: "sent",
      });

      if (result?.error) {
        setSendError("Message could not be sent. Please try again.");
        return;
      }

      setNewMessage("");
      setReplyTo(null);
      setIsTyping(false);

      await fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: activeUser.id, adminTyping: false }),
      });
    } catch (error) {
      console.error("Unable to send admin message:", error);
      setSendError("Message could not be sent. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // ✅ استعلام حالة الكتابة للمستخدم
  useEffect(() => {
    if (!activeUser) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${activeUser.id}`);
      const data = await res.json();
      setUserTyping(data.isTyping);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeUser]);

  if (!activeUser) return null;

  return (
    <section className="admin-chat-panel">
      <EgyptianBackground />
      <ChatHeader activeUser={activeUser} theme={theme} themeName={themeName} />

      <ChatMessages
        messages={activeMessages}
        userTyping={userTyping}
        themeName={themeName}
      />

      <ChatInput
        activeUser={activeUser}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        setIsTyping={setIsTyping}
        theme={theme}
        themeName={themeName}
      />
      {sendError ? <p className="admin-chat-send-error" role="alert">{sendError}</p> : null}
    </section>
  );
};

export default ChatSection;
