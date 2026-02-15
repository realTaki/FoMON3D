import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={
        "flex h-10 w-full rounded-lg border border-[rgba(0,255,245,0.4)] bg-[#0a0a0f] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00fff5]/50 focus:border-[#00fff5] " +
        className
      }
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
