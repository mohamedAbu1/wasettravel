export default function ViatorIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M4.25 5.25 9.5 18.75h2.12l5.2-13.5h-2.4l-3.84 10.28L6.65 5.25h-2.4Z"
        fill="currentColor"
      />
      <path d="M17.75 5.25h2v13.5h-2V5.25Z" fill="currentColor" />
    </svg>
  );
}
