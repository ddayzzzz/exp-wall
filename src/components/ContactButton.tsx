import type { ButtonHTMLAttributes } from "react";

interface ContactButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/**
 * 藥丸圓角、多色漸層背景的聯絡按鈕
 * 背景: linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)
 * 內陰影 + 白色 2px 外描邊(偏移 -3px)
 */
export default function ContactButton({
  label = "聯繫我",
  className = "",
  ...props
}: ContactButtonProps) {
  return (
    <button
      {...props}
      className={`relative inline-flex items-center justify-center rounded-full uppercase text-white
        px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base md:px-10 md:py-4 md:text-base
        font-medium tracking-wide
        transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]
        ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.25), inset 0 -6px 12px rgba(0,0,0,0.35), 0 0 0 2px #ffffff, 0 0 0 3px transparent, 0 8px 24px rgba(182,0,168,0.25)",
        outline: "2px solid #ffffff",
        outlineOffset: "-3px",
      }}
    >
      {label}
    </button>
  );
}
