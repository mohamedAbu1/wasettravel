"use client";
import EmojiPicker from "emoji-picker-react";

export default function ReviewForm({
  comment,
  setComment,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  onSubmit,
  placeholder,
  submitLabel,
  themeName,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="w-[70%] flex items-center gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3 rounded-lg border focus:outline-none ${
            themeName === "dark"
              ? "bg-black/60 border-gold/50 text-gold"
              : "bg-[#fdf6e3] border-[#c9a34a]/50 text-[#3a2c0a]"
          }`}
          rows={3}
        />

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          😀
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>

      <button
        type="submit"
        className={`px-6 py-2 rounded-lg font-semibold transition ${
          themeName === "dark"
            ? "bg-gold text-black hover:bg-yellow-300"
            : "bg-[#c9a34a] text-white hover:bg-[#a67c00]"
        }`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
