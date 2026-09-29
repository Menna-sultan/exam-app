
import { cn } from "@/shared/lib/utils/tailwind-cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  endAdornment?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, endAdornment, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 block"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full h-11 rounded-xl border border-[#dfeaf7] bg-[#f8fbff] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-[#1b7af4] focus:ring-4 focus:ring-blue-100",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100",
            endAdornment && "pr-10",
            className
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

export { Input };
