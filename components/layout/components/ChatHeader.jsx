"use client";
import { useTranslation } from "react-i18next";

export default function ChatHeader({ onClose }) {
    const { t } = useTranslation("home");
  
  return (
    <div className="conversation-header">
      <div><span className="conversation-header__brand">Waset Travel {t("Support")}</span><span className="conversation-header__status"><i /> Usually replies within a few minutes</span></div>
      <button
        onClick={onClose}
        style={{ cursor: "pointer" }}
        aria-label="Close chat"
        className="conversation-close-button"
      >
        ×
      </button>
    </div>
  );
}
