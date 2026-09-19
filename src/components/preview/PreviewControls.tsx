import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

export function PreviewControls() {
  const { previewZoom, setPreviewZoom } = useInvoiceStore();

  const handleZoomIn = () => {
    setPreviewZoom((prev) => Math.min(150, prev + 10));
  };

  const handleZoomOut = () => {
    setPreviewZoom((prev) => Math.max(40, prev - 10));
  };

  const handleResetZoom = () => {
    setPreviewZoom(100);
  };

  const handleFitWidth = () => {
    if (typeof window !== "undefined") {
      const containerWidth = Math.min(window.innerWidth - 32, 800);
      const calculatedScale = Math.round((containerWidth / 800) * 100);
      setPreviewZoom(Math.max(40, Math.min(100, calculatedScale)));
    }
  };

  return (
    <div className="flex items-center justify-between bg-zinc-100/90 border border-zinc-200/90 rounded-[4px] px-2.5 py-1.5 text-xs print:hidden shadow-2xs">
      <span className="text-[11px] font-medium text-zinc-600 truncate">
        Document Preview
      </span>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleFitWidth}
          className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1"
          title="Fit to screen width"
          aria-label="Fit to screen width"
        >
          <Maximize2 className="h-3 w-3" />
          <span className="hidden sm:inline">Fit</span>
        </button>

        <div className="h-3 w-px bg-zinc-300 mx-0.5" />

        <button
          type="button"
          onClick={handleZoomOut}
          disabled={previewZoom <= 40}
          className="p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 rounded-[3px] disabled:opacity-40 transition-colors cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <span className="text-[11px] font-mono font-medium text-zinc-700 w-9 text-center select-none">
          {previewZoom}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={previewZoom >= 150}
          className="p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 rounded-[3px] disabled:opacity-40 transition-colors cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <div className="h-3.5 w-px bg-zinc-300 mx-0.5" />

        <button
          type="button"
          onClick={handleResetZoom}
          className="p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 rounded-[3px] transition-colors cursor-pointer"
          title="Reset zoom to 100%"
          aria-label="Reset zoom to 100%"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
