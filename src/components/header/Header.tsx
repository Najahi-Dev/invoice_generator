"use client";

import React, { useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  FolderOpen,
  Plus,
  Printer,
  Sparkles,
  Layers,
  Eye,
  Edit3,
} from "lucide-react";
import { DraftsModal } from "./DraftsModal";
import { TemplateTheme } from "@/types/invoice";

export function Header() {
  const {
    invoice,
    savedDrafts,
    loadSampleInvoice,
    resetInvoice,
    setTheme,
    activeTab,
    setActiveTab,
  } = useInvoiceStore();

  const [isDraftsOpen, setIsDraftsOpen] = useState(false);

  const themeOptions: { value: TemplateTheme; label: string; bg: string }[] = [
    { value: "indigo", label: "Indigo", bg: "bg-indigo-600" },
    { value: "slate", label: "Slate", bg: "bg-slate-800" },
    { value: "emerald", label: "Emerald", bg: "bg-emerald-600" },
    { value: "blue", label: "Cobalt", bg: "bg-blue-600" },
    { value: "violet", label: "Violet", bg: "bg-violet-600" },
    { value: "rose", label: "Rose", bg: "bg-rose-600" },
    { value: "monochrome", label: "Monochrome", bg: "bg-zinc-950" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 py-2.5 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Active File Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[4px] bg-zinc-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
              <FileText className="h-4 w-4 text-zinc-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-zinc-900 tracking-tight">
                  Global Invoice Generator
                </span>
                <span className="hidden md:inline-flex items-center text-[10px] uppercase font-mono px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-[3px] border border-zinc-200">
                  v1.0 Pro
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Mobile Editor/Preview Toggle */}
        <div className="flex lg:hidden items-center bg-zinc-100 p-0.5 rounded-[4px] border border-zinc-200">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[3px] transition-colors ${
              activeTab === "editor"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Form
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[3px] transition-colors ${
              activeTab === "preview"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-50 border border-zinc-200 p-1 rounded-[4px]">
            <Layers className="h-3.5 w-3.5 text-zinc-400 ml-1 mr-0.5" />
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`h-4 w-4 rounded-[2px] transition-all ${opt.bg} ${
                  invoice.theme === opt.value
                    ? "ring-2 ring-zinc-900 ring-offset-1 scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
                title={`Theme: ${opt.label}`}
                aria-label={`Theme: ${opt.label}`}
              />
            ))}
          </div>

          {/* Load Sample Demo */}
          <Button
            size="sm"
            variant="outline"
            onClick={loadSampleInvoice}
            className="hidden sm:inline-flex text-xs"
            title="Load sample invoice with pre-filled items"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden md:inline">Sample Data</span>
            <span className="md:hidden">Sample</span>
          </Button>

          {/* New Invoice */}
          <Button
            size="sm"
            variant="outline"
            onClick={resetInvoice}
            className="text-xs"
            title="Start a blank invoice"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:inline">New</span>
          </Button>

          {/* Saved Drafts */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsDraftsOpen(true)}
            className="text-xs relative"
            title="Open saved drafts"
          >
            <FolderOpen className="h-3.5 w-3.5 text-zinc-600" />
            <span className="hidden md:inline">Drafts</span>
            {savedDrafts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-semibold bg-zinc-900 text-white rounded-[3px]">
                {savedDrafts.length}
              </span>
            )}
          </Button>

          {/* Print preview */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handlePrint}
            className="text-xs"
            title="Print or Save via Browser Print"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Print</span>
          </Button>
        </div>
      </div>

      <DraftsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
      />
    </header>
  );
}
