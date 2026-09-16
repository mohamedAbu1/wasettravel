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
    <form onSubmit={onSubmit} className="trip-review-form space-y-4">
      <div className="flex flex-col gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className="min-h-32 w-full resize-y rounded-xl border bg-[var(--surface)] p-4 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--color)] focus:ring-2 focus:ring-[var(--color)]/20"
          rows={3}
          required
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="relative"><button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} aria-expanded={showEmojiPicker} className="trip-detail-icon-button"><span aria-hidden="true">😀</span> Add feeling</button>{showEmojiPicker && <div className="absolute bottom-12 left-0 z-20"><EmojiPicker onEmojiClick={onEmojiClick} theme={themeName === "dark" ? "dark" : "light"}/></div>}</div>

      <button
        type="submit"
        className="trip-detail-action"
      >
        {submitLabel}
      </button>
      </div>
    </form>
  );
}
