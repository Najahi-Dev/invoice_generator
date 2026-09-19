import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      children,
      prefixElement,
      suffixElement,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-zinc-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {prefixElement && (
            <div className="absolute left-2.5 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
              {prefixElement}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-8 sm:h-9 text-xs sm:text-sm bg-white text-zinc-900 border rounded-[4px] pl-2.5 pr-8 transition-all outline-none appearance-none cursor-pointer",
              "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
              "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
              prefixElement && "pl-7 sm:pl-8",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          {suffixElement ? (
            <div className="absolute right-2.5 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
              {suffixElement}
            </div>
          ) : (
            <ChevronDown className="absolute right-2.5 h-4 w-4 pointer-events-none text-zinc-500" />
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

Select.displayName = "Select";
