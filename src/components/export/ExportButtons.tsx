"use client";

import React, { useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Button } from "@/components/ui/Button";
import { exportInvoiceToPdf } from "@/lib/utils/exportPdf";
import { exportInvoiceToImage } from "@/lib/utils/exportImage";
import { exportInvoiceToExcel } from "@/lib/utils/exportExcel";
import {
  FileDown,
  Image as ImageIcon,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function ExportButtons() {
  const { invoice, activeTab, setActiveTab } = useInvoiceStore();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingImage, setLoadingImage] = useState<"png" | "jpeg" | false>(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Helper to ensure target element is mounted, visible, and fully painted
  const ensurePreviewReady = async (elementId = "invoice-preview-document"): Promise<HTMLElement> => {
    // If on mobile/small screen and currently on editor tab, switch to preview
    if (activeTab === "editor" && window.innerWidth < 1024) {
      setActiveTab("preview");
      // Wait for React to render and paint preview tab
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Wait for next animation frame to ensure layout recalculation is complete
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Invoice preview element not found. Please switch to the Preview tab.");
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      // Give an extra frame in case of animation/transitions
      await new Promise((resolve) => setTimeout(resolve, 100));
      const retryRect = element.getBoundingClientRect();
      if (retryRect.width === 0 || retryRect.height === 0) {
        throw new Error(
          "Invoice preview has zero size. Please ensure the preview panel is open and visible."
        );
      }
    }

    return element;
  };

  const handleExportPdf = async () => {
    setLoadingPdf(true);
    try {
      await ensurePreviewReady("invoice-preview-document");

      const success = await exportInvoiceToPdf({
        elementId: "invoice-preview-document",
        invoice,
      });

      if (success) {
        showToast("success", "PDF downloaded successfully!");
      } else {
        showToast("error", "Failed to generate PDF. Please try again.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error creating PDF.";
      console.error("PDF Export Error:", err);
      showToast("error", msg);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExportImage = async (format: "png" | "jpeg") => {
    setLoadingImage(format);
    try {
      await ensurePreviewReady("invoice-preview-document");

      const success = await exportInvoiceToImage({
        elementId: "invoice-preview-document",
        format,
        invoice,
      });

      if (success) {
        showToast("success", `${format.toUpperCase()} image downloaded!`);
      } else {
        showToast("error", `Failed to generate ${format.toUpperCase()} image.`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Error creating ${format.toUpperCase()} image.`;
      console.error("Image Export Error:", err);
      showToast("error", msg);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleExportExcel = () => {
    setLoadingExcel(true);
    try {
      const success = exportInvoiceToExcel(invoice);
      if (success) {
        showToast("success", "Excel workbook (.xlsx) downloaded!");
      } else {
        showToast("error", "Failed to export Excel file.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error creating Excel file.";
      console.error("Excel Export Error:", err);
      showToast("error", msg);
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-[6px] p-3.5 shadow-xs space-y-3 print:hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <FileDown className="h-3.5 w-3.5 text-zinc-700" />
          Export & Download
        </span>
        {statusMessage && (
          <div
            className={`flex items-center gap-1 text-[11px] font-medium transition-all max-w-[60%] truncate ${
              statusMessage.type === "success"
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
            title={statusMessage.text}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-3 w-3 shrink-0" />
            ) : (
              <AlertCircle className="h-3 w-3 shrink-0" />
            )}
            <span className="truncate">{statusMessage.text}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* PDF Export */}
        <Button
          type="button"
          variant="primary"
          size="md"
          isLoading={loadingPdf}
          onClick={handleExportPdf}
          className="w-full text-xs sm:text-[13px] font-semibold h-10 sm:h-9"
        >
          <FileDown className="h-4 w-4 shrink-0" />
          <span>PDF</span>
        </Button>

        {/* PNG Export */}
        <Button
          type="button"
          variant="outline"
          size="md"
          isLoading={loadingImage === "png"}
          onClick={() => handleExportImage("png")}
          className="w-full text-xs sm:text-[13px] font-semibold h-10 sm:h-9"
        >
          <ImageIcon className="h-4 w-4 shrink-0 text-blue-600" />
          <span>PNG</span>
        </Button>

        {/* Excel Export */}
        <Button
          type="button"
          variant="outline"
          size="md"
          isLoading={loadingExcel}
          onClick={handleExportExcel}
          className="w-full text-xs sm:text-[13px] font-semibold h-10 sm:h-9"
        >
          <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Excel</span>
        </Button>

        {/* Direct Print */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => window.print()}
          className="w-full text-xs sm:text-[13px] font-semibold h-10 sm:h-9"
        >
          <Printer className="h-4 w-4 shrink-0 text-zinc-700" />
          <span>Print</span>
        </Button>
      </div>
    </div>
  );
}
