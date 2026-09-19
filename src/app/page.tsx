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
    <div className="min-h-screen flex flex-col bg-slate-100/50">
      {/* Top Application Header */}
      <Header />

      {/* Main Workbench Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor (Visible on desktop or when activeTab === 'editor' on mobile) */}
          <div
            className={`lg:col-span-6 xl:col-span-5 ${
              mounted && activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <InvoiceForm />
          </div>

          {/* Right Column: Live Interactive Preview & Export (Visible on desktop or when activeTab === 'preview' on mobile) */}
          <div
            className={`lg:col-span-6 xl:col-span-7 ${
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
