"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SenderSection } from "./SenderSection";
import { RecipientSection } from "./RecipientSection";
import { MetadataSection } from "./MetadataSection";
import { LineItemsTable } from "./LineItemsTable";
import { SummarySection } from "./SummarySection";
import { PaymentNotesSection } from "./PaymentNotesSection";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import {
  Building2,
  User,
  FileSpreadsheet,
  ListPlus,
  CreditCard,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export type SectionKey = "meta" | "sender" | "recipient" | "items" | "payment";

interface SectionConfig {
  id: SectionKey;
  step: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
}

const SECTIONS: SectionConfig[] = [
  {
    id: "meta",
    step: 1,
    title: "Invoice Details & Currency",
    shortTitle: "Invoice Details",
    description: "Document title, currency, invoice #, PO #, and issue/due dates",
    icon: FileSpreadsheet,
  },
  {
    id: "sender",
    step: 2,
    title: "Company / Sender Details",
    shortTitle: "Sender Details",
    description: "Your business profile, address, logo, and contact info",
    icon: Building2,
  },
  {
    id: "recipient",
    step: 3,
    title: "Client / Recipient Details",
    shortTitle: "Client Details",
    description: "Client name, company, email, phone, and billing address",
    icon: User,
  },
  {
    id: "items",
    step: 4,
    title: "Line Items & Calculations",
    shortTitle: "Line Items",
    description: "Products, services, rates, taxes, discounts, and payment summary",
    icon: ListPlus,
  },
  {
    id: "payment",
    step: 5,
    title: "Payment Instructions, Notes & Terms",
    shortTitle: "Payment & Terms",
    description: "Bank transfer details, client notes, terms & conditions, and signature",
    icon: CreditCard,
  },
];

export function InvoiceForm() {
  const [activeSection, setActiveSection] = useState<SectionKey>("meta");
  const { invoice } = useInvoiceStore();

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSection = SECTIONS[currentIndex] || SECTIONS[0];

  const handleNext = () => {
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSection(SECTIONS[currentIndex - 1].id);
    }
  };

  // Dynamic status / subtitle badges for each sidebar item
  const getSectionSubtitle = (id: SectionKey): string => {
    switch (id) {
      case "meta":
        return `${invoice.metadata.currency} • ${invoice.metadata.invoiceNumber || "INV-001"}`;
      case "sender":
        return invoice.sender.name || "Add sender details";
      case "recipient":
        return invoice.recipient.name || invoice.recipient.companyName || "Add client details";
      case "items":
        return `${invoice.items.length} ${invoice.items.length === 1 ? "Item" : "Items"} • ${formatCurrency(
          invoice.summary.grandTotal,
          invoice.metadata.currency
        )}`;
      case "payment":
        return invoice.paymentDetails.method ? `Method: ${invoice.paymentDetails.method}` : "Bank & Notes";
    }
  };

  const isSectionComplete = (id: SectionKey): boolean => {
    switch (id) {
      case "meta":
        return Boolean(invoice.metadata.invoiceNumber && invoice.metadata.issueDate);
      case "sender":
        return Boolean(invoice.sender.name);
      case "recipient":
        return Boolean(invoice.recipient.name || invoice.recipient.companyName);
      case "items":
        return invoice.items.length > 0 && invoice.items.some((i) => i.description && i.unitPrice > 0);
      case "payment":
        return Boolean(invoice.paymentDetails.bankName || invoice.notes || invoice.terms);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Sidebar Navigation Menu */}
      <div className="bg-white border border-zinc-200/90 rounded-[6px] shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-600">
              Form Sections
            </span>
          </div>
          <span className="text-[11px] font-medium text-zinc-500 bg-white border border-zinc-200/80 px-2 py-0.5 rounded-[4px]">
            Step {currentSection.step} of {SECTIONS.length}
          </span>
        </div>

        {/* Sidebar Items List */}
        <div className="divide-y divide-zinc-100">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isCompleted = isSectionComplete(section.id);
            const subtitle = getSectionSubtitle(section.id);

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full text-left px-3.5 sm:px-4 py-3 transition-all flex items-center gap-3 group relative cursor-pointer",
                  isActive
                    ? "bg-blue-50/50 text-blue-950 font-medium"
                    : "hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900"
                )}
              >
                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600" />
                )}

                {/* Icon Container */}
                <div
                  className={cn(
                    "h-8 w-8 rounded-[5px] flex items-center justify-center shrink-0 transition-colors border",
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : isCompleted
                      ? "bg-zinc-100 text-zinc-700 border-zinc-200/80 group-hover:bg-blue-100/50 group-hover:text-blue-700"
                      : "bg-zinc-50 text-zinc-500 border-zinc-200/60 group-hover:text-zinc-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Title and Subtitle Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold leading-tight truncate">
                      {section.title}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[11px] truncate mt-0.5",
                      isActive ? "text-blue-700/80 font-normal" : "text-zinc-500 font-normal"
                    )}
                  >
                    {subtitle}
                  </p>
                </div>

                {/* Right Arrow / Active Indicator */}
                <div className="shrink-0 flex items-center">
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isActive
                        ? "text-blue-600 translate-x-0.5"
                        : "text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5"
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Section Input Panel */}
      <Card className="border-zinc-200/90 shadow-xs">
        {/* Section Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 bg-gradient-to-r from-zinc-50/70 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-[4px] bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              {React.createElement(currentSection.icon, { className: "h-3.5 w-3.5" })}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  Step {currentSection.step} of 5
                </span>
              </div>
              <h2 className="text-[14px] font-bold text-zinc-900 tracking-tight leading-tight truncate">
                {currentSection.title}
              </h2>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 hidden sm:block truncate max-w-[200px] text-right">
            {currentSection.description}
          </div>
        </div>

        {/* Section Content / Input Fields */}
        <CardContent className="p-4 sm:p-5">
          {activeSection === "meta" && <MetadataSection />}
          {activeSection === "sender" && <SenderSection />}
          {activeSection === "recipient" && <RecipientSection />}
          {activeSection === "items" && (
            <div className="space-y-5">
              <LineItemsTable />
              <SummarySection />
            </div>
          )}
          {activeSection === "payment" && <PaymentNotesSection />}
        </CardContent>

        {/* Section Navigation Footer (Previous / Next buttons) */}
        <div className="px-4 sm:px-5 py-3.5 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "h-8 px-3 rounded-[4px] border text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer",
              currentIndex === 0
                ? "border-zinc-200 text-zinc-300 cursor-not-allowed bg-white"
                : "border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:text-zinc-900 shadow-2xs"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {/* Quick step dots indicator */}
          <div className="flex items-center gap-1.5">
            {SECTIONS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "h-2 rounded-full transition-all cursor-pointer",
                  activeSection === s.id
                    ? "w-6 bg-blue-600"
                    : isSectionComplete(s.id)
                    ? "w-2 bg-emerald-500 hover:bg-emerald-600"
                    : "w-2 bg-zinc-200 hover:bg-zinc-300"
                )}
                title={`Go to ${s.title}`}
                aria-label={`Go to ${s.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === SECTIONS.length - 1}
            className={cn(
              "h-8 px-3 rounded-[4px] text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs",
              currentIndex === SECTIONS.length - 1
                ? "border border-zinc-200 text-zinc-300 cursor-not-allowed bg-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </Card>
    </div>
  );
}

