"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: React.ReactNode;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  isAlertOnly?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "danger",
  confirmText,
  cancelText = "Cancel",
  isAlertOnly = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const defaultConfirmText = isAlertOnly
    ? "Got it"
    : type === "danger"
    ? "Delete"
    : "Confirm";

  const getIconAndColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-rose-600" />,
          badgeBg: "bg-rose-100/80 border-rose-200",
          btnVariant: "danger" as const,
        };
      case "warning":
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
          badgeBg: "bg-amber-100/80 border-amber-200",
          btnVariant: "primary" as const,
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
          badgeBg: "bg-emerald-100/80 border-emerald-200",
          btnVariant: "primary" as const,
        };
      case "info":
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-600" />,
          badgeBg: "bg-blue-100/80 border-blue-200",
          btnVariant: "primary" as const,
        };
    }
  };

  const { icon, badgeBg, btnVariant } = getIconAndColors();

  const handleConfirmAction = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const dialogContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-zinc-200/90 rounded-[6px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Icon Container */}
            <div
              className={cn(
                "h-10 w-10 rounded-[6px] flex items-center justify-center shrink-0 border shadow-2xs",
                badgeBg
              )}
            >
              {icon}
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-zinc-900 leading-tight">
                {title}
              </h3>
              <div className="text-xs sm:text-[13px] text-zinc-600 mt-1.5 leading-relaxed">
                {description}
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-[3px] hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
            {!isAlertOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
                className="text-xs h-8 px-3"
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="button"
              variant={btnVariant}
              size="sm"
              isLoading={isLoading}
              onClick={handleConfirmAction}
              className="text-xs h-8 px-4 font-semibold"
            >
              {confirmText || defaultConfirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
