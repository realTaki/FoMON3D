import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "neon" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:pointer-events-none px-4 py-2 ";
    const variants = {
      default:
        "bg-[#0ea5e9] text-white border border-[#00fff5] shadow-[0_0_15px_rgba(0,255,245,0.3)] hover:shadow-[0_0_25px_rgba(0,255,245,0.5)]",
      neon:
        "bg-transparent text-[#00fff5] border border-[#00fff5] shadow-[0_0_15px_rgba(0,255,245,0.4)] hover:shadow-[0_0_25px_rgba(0,255,245,0.6)] hover:bg-[#00fff5]/10",
      outline:
        "bg-transparent text-slate-300 border border-slate-500 hover:border-[#00fff5]/50 hover:text-[#00fff5]",
    };
    return (
      <button
        ref={ref}
        className={base + variants[variant] + " " + className}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
