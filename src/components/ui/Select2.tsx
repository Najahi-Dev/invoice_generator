"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface Select2Option {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  disabled?: boolean;
}

export interface Select2Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Select2Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  prefixElement?: React.ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

export function Select2({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  prefixElement,
  error,
  helperText,
  className,
  id,
  disabled = false,
  allowClear = false,
}: Select2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : generatedId);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search query
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.subLabel && opt.subLabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setHighlightedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[12px] font-medium text-zinc-700 select-none flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}

      <div className="relative w-full">
        {/* Main Trigger Button */}
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            "w-full h-9 text-[13px] bg-white text-zinc-900 border rounded-[4px] px-3 transition-all outline-none flex items-center justify-between gap-2 cursor-pointer shadow-2xs select-none",
            "border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
            isOpen && "border-zinc-900 ring-1 ring-zinc-900",
            disabled && "bg-zinc-50 text-zinc-400 cursor-not-allowed",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {prefixElement && (
              <span className="text-zinc-400 text-xs shrink-0">{prefixElement}</span>
            )}
            {selectedOption ? (
              <div className="flex items-center gap-2 min-w-0 truncate">
                <span className="font-medium truncate">{selectedOption.label}</span>
                {selectedOption.subLabel && (
                  <span className="text-xs text-zinc-500 truncate">
                    • {selectedOption.subLabel}
                  </span>
                )}
                {selectedOption.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 border border-zinc-200 rounded text-zinc-600">
                    {selectedOption.badge}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-zinc-400 truncate">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {allowClear && value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-sm hover:bg-zinc-100 cursor-pointer"
                title="Clear selection"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-zinc-400 transition-transform duration-150",
                isOpen && "rotate-180 text-zinc-800"
              )}
            />
          </div>
        </button>

        {/* Select2 Dropdown Popover */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-zinc-200/90 rounded-[6px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 min-w-[240px]">
            {/* Search Input Box */}
            <div className="p-2 border-b border-zinc-100 bg-zinc-50/60 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div
              ref={listRef}
              className="max-h-60 overflow-y-auto divide-y divide-zinc-50 p-1"
              role="listbox"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-zinc-400">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        if (!opt.disabled) {
                          onChange(opt.value);
                          setIsOpen(false);
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "px-2.5 py-2 text-xs rounded-[4px] flex items-center justify-between gap-2 cursor-pointer transition-colors select-none",
                        isHighlighted && "bg-blue-50/80 text-blue-950",
                        isSelected && "font-semibold text-blue-700 bg-blue-50/50",
                        opt.disabled && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="truncate">{opt.label}</span>
                        {opt.subLabel && (
                          <span className="text-[11px] text-zinc-400 truncate">
                            ({opt.subLabel})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {opt.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 border border-zinc-200 rounded text-zinc-600">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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
