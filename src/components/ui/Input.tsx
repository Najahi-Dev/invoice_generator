import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      prefixElement,
      suffixElement,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-zinc-700 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center w-full">
          {prefixElement && (
            <div className="absolute left-2.5 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-8 sm:h-9 text-xs sm:text-sm bg-white text-zinc-900 placeholder:text-zinc-400 border rounded-[4px] px-2.5 transition-all outline-none",
              "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
              "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
              prefixElement && "pl-7 sm:pl-8",
              suffixElement && "pr-7 sm:pr-8",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-2.5 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
              {suffixElement}
            </div>
          )}
        </div>
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

Input.displayName = "Input";
