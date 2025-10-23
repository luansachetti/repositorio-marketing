import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary";
  full?: boolean;
}

export default function Button({
  label,
  variant = "primary",
  full = true,
  ...props
}: ButtonProps) {
  const base =
    "py-3 px-6 rounded-xl font-semibold tracking-wide transition-all duration-200 shadow-md text-center";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-900/30 active:scale-95",
    secondary:
      "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm active:scale-95",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${
        full ? "w-full" : "w-auto px-6"
      }`}
    >
      {label}
    </button>
  );
}
