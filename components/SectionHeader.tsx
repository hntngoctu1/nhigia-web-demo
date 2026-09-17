import type { ReactNode } from "react";

type Tone = "light" | "dark";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  cta?: ReactNode;
  align?: "left" | "center";
  tone?: Tone;
  className?: string;
  as?: "h1" | "h2";
};

export default function SectionHeader({
  eyebrow,
  title,
  lead,
  cta,
  align = "left",
  tone = "light",
  className = "",
  as: Tag = "h2",
}: Props) {
  const isDark = tone === "dark";
  const center = align === "center";
  const isPageTitle = Tag === "h1";

  return (
    <div
      className={`mb-10 md:mb-12 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <p
        className={`section-eyebrow ${
          isDark ? "!text-[color:var(--gold-soft)]" : ""
        }`}
      >
        {eyebrow}
      </p>
      <Tag
        className={`mt-2.5 font-extrabold tracking-tight ${
          isPageTitle
            ? "text-[1.875rem] leading-[1.15] sm:text-4xl"
            : "section-title"
        } ${isDark ? "text-white" : "text-navy"}`}
      >
        {title}
      </Tag>
      {lead ? (
        <p
          className={`section-lead mt-3.5 ${
            isDark ? "!text-blue-100" : ""
          }`}
        >
          {lead}
        </p>
      ) : null}
      {cta ? (
        <div className={`mt-5 ${center ? "flex justify-center" : ""}`}>{cta}</div>
      ) : null}
    </div>
  );
}
