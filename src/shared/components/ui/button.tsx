import { cn } from "@/shared/lib/utils/tailwind-cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md" | "lg" | "icon" | "icon-xs" | "icon-sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1b7af4] text-white hover:bg-[#156fe0] disabled:bg-[#9dc1f7] shadow-sm shadow-blue-500/20",
  outline:
    "border border-[#d5e7ff] bg-[#f7fbff] text-[#1f3d5d] hover:bg-[#edf5ff] disabled:text-slate-400",
  danger:
    "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:text-red-200",
  ghost: "text-[#2f5d99] hover:bg-[#edf5ff] hover:text-[#1d4b86]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-11 px-5 text-sm rounded-xl",
  icon: "h-10 w-10 p-0 text-sm rounded-xl",
  "icon-xs": "h-6 w-6 p-0 text-xs rounded-lg",
  "icon-sm": "h-8 w-8 p-0 text-sm rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
