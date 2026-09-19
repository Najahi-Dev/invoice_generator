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
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium text-zinc-700 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center w-full">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-9 text-[13px] bg-white text-zinc-900 placeholder:text-zinc-400 border rounded-[4px] px-3 transition-all outline-none shadow-2xs",
              "border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
              "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
              prefixElement && "pl-8 sm:pl-9",
              suffixElement && "pr-8 sm:pr-9",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
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
