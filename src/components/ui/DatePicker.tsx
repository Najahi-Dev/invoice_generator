"use client";

import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { cn } from "@/lib/utils/cn";
import { Calendar as CalendarIcon, X } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  error,
  helperText,
  className,
  id,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    fpRef.current = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      defaultDate: value || undefined,
      minDate: minDate || undefined,
      maxDate: maxDate || undefined,
      disableMobile: true, // Uses flatpickr's custom UI consistently
      allowInput: true,
      onChange: (_selectedDates, dateStr) => {
        onChange(dateStr);
      },
    });

    return () => {
      fpRef.current?.destroy();
    };
  }, []);

  // Update value dynamically if changed from props
  useEffect(() => {
    if (fpRef.current && value !== undefined) {
      if (fpRef.current.input.value !== value) {
        fpRef.current.setDate(value || "", false);
      }
    }
  }, [value]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fpRef.current) {
      fpRef.current.clear();
      onChange("");
    }
  };

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

      <div className="relative flex items-center w-full group">
        <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400 text-xs font-medium z-10">
          <CalendarIcon className="h-3.5 w-3.5" />
        </div>

        <input
          id={inputId}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={cn(
            "w-full h-9 text-[13px] bg-white text-zinc-900 placeholder:text-zinc-400 border rounded-[4px] pl-9 pr-8 transition-all outline-none shadow-2xs cursor-pointer",
            "border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
            "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 text-zinc-400 hover:text-zinc-700 rounded-[3px] hover:bg-zinc-100 transition-colors cursor-pointer z-10"
            title="Clear date"
            aria-label="Clear date"
          >
            <X className="h-3.5 w-3.5" />
          </button>
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
