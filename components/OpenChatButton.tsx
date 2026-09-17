"use client";

export default function OpenChatButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("nhigia:open-chat"))}
    >
      {children}
    </button>
  );
}
