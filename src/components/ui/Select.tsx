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
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-9 text-[13px] bg-white text-zinc-900 border rounded-[4px] pl-3 pr-9 transition-all outline-none appearance-none cursor-pointer shadow-2xs",
              "border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
              "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
              prefixElement && "pl-8 sm:pl-9",
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
            <div className="absolute right-3 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
              {suffixElement}
            </div>
          ) : (
            <ChevronDown className="absolute right-3 h-4 w-4 pointer-events-none text-zinc-400" />
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
