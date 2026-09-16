"use client";
import { useTranslation } from "react-i18next";

export default function ChatHeader({ onClose, theme }) {
    const { t } = useTranslation("home");
  
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[#30271d] px-4 py-3.5 text-[#f8f1e7]">
      <div><span className="block text-sm font-bold capitalize">Waset Travel {t("Support")}</span><span className="mt-0.5 block text-[11px] text-white/55">Usually replies within a few minutes</span></div>
      <button
        onClick={onClose}
        style={{ cursor: "pointer" }}
        aria-label="Close chat"
        className="grid h-9 w-9 place-items-center rounded-xl text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0b873]"
      >
        ×
      </button>
    </div>
  );
}
