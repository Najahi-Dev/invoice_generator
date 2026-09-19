import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-zinc-700 select-none"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full text-xs sm:text-sm bg-white text-zinc-900 placeholder:text-zinc-400 border rounded-[4px] p-2.5 transition-all outline-none resize-y min-h-[70px]",
            "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
            "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-[11px] text-rose-600 font-medium leading-tight">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-[11px] text-zinc-500 leading-tight">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
