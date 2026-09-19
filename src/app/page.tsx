"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/header/Header";
import { InvoiceForm } from "@/components/form/InvoiceForm";
import { InvoicePreview } from "@/components/preview/InvoicePreview";
import { useInvoiceStore } from "@/store/useInvoiceStore";

export default function InvoiceWorkbenchPage() {
  const { activeTab } = useInvoiceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 overflow-x-hidden">
      {/* Top Application Header */}
      <Header />

      {/* Main Workbench Body */}
      <main className="flex-1 w-full max-w-[1520px] mx-auto p-3 sm:p-5 lg:p-8 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start w-full min-w-0">
          {/* Left Column: Form Editor (Visible on desktop or when activeTab === 'editor' on mobile) */}
          <div
            className={`w-full min-w-0 lg:col-span-6 xl:col-span-5 ${
              mounted && activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <InvoiceForm />
          </div>

          {/* Right Column: Live Interactive Preview & Export (Visible on desktop or when activeTab === 'preview' on mobile) */}
          <div
            className={`w-full min-w-0 lg:col-span-6 xl:col-span-7 ${
              mounted && activeTab === "editor" ? "hidden lg:block" : "block"
            }`}
          >
            <InvoicePreview />
          </div>
        </div>
      </main>
    </div>
  );
}
