"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useUsers } from "../context/UserContext";
import UsersSidebar from "./components/UsersSidebar";
import ChatSection from "./components/ChatSection";
import { useMessages } from "@/context/MessageContext";
import { FaBell, FaCheckCircle, FaDesktop, FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";

export default function MessagesPage() {
  const { theme, themeName } = useTheme();
  const { users = [] } = useUsers();
  const { messages, setMessages } = useMessages();

  const [activeUser, setActiveUser] = useState(null);
  const [connectionState, setConnectionState] = useState("connecting");
  const [desktopPermission, setDesktopPermission] = useState("default");
  const [newMessageNotice, setNewMessageNotice] = useState(null);
  const [syncError, setSyncError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const knownMessagesRef = useRef(new Map());
  const firstSyncRef = useRef(true);

  const unreadMessages = useMemo(
    () => messages.filter((message) => message.sender_type === "user" && message.status === "sent"),
    [messages],
  );

  const conversationUsers = useMemo(() => {
    const byId = new Map((Array.isArray(users) ? users : []).map((user) => [String(user.id), user]));
    messages.forEach((message) => {
      if (message.sender_type !== "user" || message.user_id == null) return;
      const key = String(message.user_id);
      if (!byId.has(key)) byId.set(key, { id: message.user_id, name: message.user_name, image: message.user_image });
    });
    return Array.from(byId.values());
  }, [messages, users]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setDesktopPermission(Notification.permission);
    }
  }, []);

  const requestDesktopNotifications = async () => {
    if (!("Notification" in window)) {
      setDesktopPermission("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    setDesktopPermission(permission);
  };

  useEffect(() => {
    let cancelled = false;

    const syncMessages = async () => {
      try {
        const response = await fetch("/api/messages", { cache: "no-store" });
        if (!response.ok) throw new Error(`Messages request failed (${response.status})`);
        const data = await response.json();
        if (cancelled || !Array.isArray(data)) return;

        const incoming = data.filter(
          (message) => message.sender_type === "user" && message.status === "sent",
        );
        const previousMessages = knownMessagesRef.current;
        const freshMessages = firstSyncRef.current
          ? []
          : incoming.filter((message) => !previousMessages.has(String(message.id)));

        knownMessagesRef.current = new Map(
          data.map((message) => [String(message.id), message.status]),
        );
        firstSyncRef.current = false;
        setMessages(data);
        setConnectionState("online");
        setSyncError("");
        setLastSyncedAt(new Date());

        if (freshMessages.length > 0) {
          const firstMessage = freshMessages[0];
          const isCurrentConversation = String(activeUser?.id) === String(firstMessage.user_id);
          setNewMessageNotice({
            count: freshMessages.length,
            userName: firstMessage.user_name || "A guest",
            userId: firstMessage.user_id,
          });

          if (
            !isCurrentConversation &&
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const notification = new Notification("New WasetTravel message", {
              body: freshMessages.length === 1
                ? `${firstMessage.user_name || "A guest"}: ${String(firstMessage.content || "New message").slice(0, 120)}`
                : `${freshMessages.length} new messages from guests`,
              icon: firstMessage.user_image || "/default-avatar.png",
              tag: "wasettravel-admin-messages",
            });
            notification.onclick = () => window.focus();
          }
        }
      } catch (error) {
        if (!cancelled) {
          setConnectionState("offline");
          setSyncError(error.message || "Unable to refresh messages.");
          console.error("Unable to sync admin messages:", error);
        }
      }
    };

    syncMessages();
    const interval = window.setInterval(syncMessages, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeUser?.id, setMessages]);

  const handleUserSelect = (user) => {
    setActiveUser(user);
    setNewMessageNotice((notice) => (notice?.userId === user.id ? null : notice));
  };

  const noticeUser = newMessageNotice
    ? conversationUsers.find((user) => String(user.id) === String(newMessageNotice.userId))
    : null;

  return (
    <main className="admin-message-workspace">
      <header className="admin-message-toolbar">
        <div>
          <p className="admin-section-eyebrow"><FaBell /> Live inbox</p>
          <h2 className="admin-section-title">Guest messages</h2>
          <p className="admin-section-description">Stay on top of conversations and reply before a lead goes cold.</p>
        </div>
        <div className="admin-message-toolbar__actions">
          <span className={`admin-message-connection admin-message-connection--${connectionState}`}><span /> {connectionState === "online" ? "Live sync" : connectionState === "offline" ? "Connection issue" : "Connecting"}</span>
          <span className="admin-message-count"><strong>{unreadMessages.length}</strong> unread</span>
          {lastSyncedAt && <span className="admin-message-last-sync">Updated {lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          {desktopPermission === "granted" ? (
            <span className="admin-desktop-status"><FaCheckCircle /> Desktop alerts on</span>
          ) : (
            <button type="button" className="admin-action-button" onClick={requestDesktopNotifications} disabled={desktopPermission === "denied"} title={desktopPermission === "denied" ? "Enable notifications from your browser settings" : "Allow desktop notifications"}>
              <FaDesktop /> {desktopPermission === "denied" ? "Alerts blocked" : "Enable desktop alerts"}
            </button>
          )}
        </div>
      </header>
      {syncError && (
        <div className="admin-message-sync-error" role="alert">
          <FaExclamationTriangle /><span>{syncError}</span>
          <button type="button" className="admin-action-button admin-action-button--small" onClick={() => window.location.reload()}><FaSyncAlt /> Retry</button>
        </div>
      )}
      {newMessageNotice && (
        <div className="admin-message-alert" role="status">
          <FaExclamationTriangle />
          <span><strong>New message{newMessageNotice.count > 1 ? "s" : ""}</strong> from {newMessageNotice.userName}</span>
          {noticeUser && <button type="button" className="admin-action-button admin-action-button--small" onClick={() => handleUserSelect(noticeUser)}>Open conversation</button>}
          <button type="button" className="admin-message-alert__dismiss" aria-label="Dismiss new message notice" onClick={() => setNewMessageNotice(null)}>×</button>
        </div>
      )}
      <UsersSidebar
        users={conversationUsers}
        activeUser={activeUser}
        setActiveUser={handleUserSelect}
        messages={messages}
      />
      <ChatSection
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        theme={theme}
        themeName={themeName}
      />
    </main>
  );
}
