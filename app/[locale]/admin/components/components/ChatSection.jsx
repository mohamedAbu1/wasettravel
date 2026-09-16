/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useMessages } from "@/context/MessageContext";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

const ChatSection = ({ activeUser, theme, themeName }) => {
  const { messages, setMessages, sendMessage, markMessageSeen } = useMessages();
  const { userData } = useAuth(); // الأدمن الحالي من التوكين
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
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
    if (!newMessage.trim()) return;

    await sendMessage({
      user_id: activeUser.id,
      user_name: userData?.name || "Admin",
      user_image: userData?.avatar_url || userData?.image || "/default-avatar.png",
      content: newMessage,
      sender_type: "admin",
      reply_to: replyTo ? replyTo.id : null,
      admin_id: userData.id,
      status: "sent",
    });

    setNewMessage("");
    setReplyTo(null);
    setIsTyping(false);

    await fetch("/api/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUser.id, adminTyping: false }),
    });
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

const handleSendImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // ✅ نضيف بيانات المستخدم
  formData.append("user_id", activeUser.id);
  formData.append("sender_type", "admin");
  formData.append("user_name", userData?.name || "Admin");
  formData.append("user_image", userData?.avatar_url || userData?.image || "/default-avatar.png");
  formData.append("admin_id", userData.id);

  const res = await fetch("/api/messages", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.error) {
    return;
  }

  const uploadedUrl = data.content || data.url;
  if (uploadedUrl) setMessages((prev) => [...prev, data]);
};


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
        handleSendImage={handleSendImage}
        activeUser={activeUser}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        setIsTyping={setIsTyping}
        theme={theme}
        themeName={themeName}
      />
    </section>
  );
};

export default ChatSection;
