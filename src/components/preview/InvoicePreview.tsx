"use client";

import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { PreviewControls } from "./PreviewControls";
import { ExportButtons } from "@/components/export/ExportButtons";

export function InvoicePreview() {
  const { invoice, previewZoom } = useInvoiceStore();

  return (
    <div className="space-y-3 sticky top-16">
      {/* Export Action Bar (prominently placed near the preview) */}
      <ExportButtons />

      {/* Preview Controls (Zoom, Fit, Status) */}
      <PreviewControls />

      {/* Preview Canvas Container */}
      <div className="bg-zinc-100/70 border border-zinc-200/90 rounded-[6px] p-3 sm:p-5 overflow-auto flex justify-center max-h-[calc(100vh-210px)] min-h-[500px]">
        <div
          className="transition-transform duration-150 origin-top w-full max-w-[800px]"
          style={{
            transform: previewZoom !== 100 ? `scale(${previewZoom / 100})` : undefined,
            transformOrigin: "top center",
          }}
        >
          <InvoiceTemplate invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
