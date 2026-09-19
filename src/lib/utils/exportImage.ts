import html2canvas from "html2canvas-pro";
import { InvoiceData } from "@/types/invoice";

export interface ExportImageOptions {
  elementId?: string;
  format?: "png" | "jpeg";
  quality?: number;
  filename?: string;
  invoice?: InvoiceData;
  scale?: number;
}

export async function exportInvoiceToImage(
  options: ExportImageOptions = {}
): Promise<boolean> {
  const {
    elementId = "invoice-preview-document",
    format = "png",
    quality = 0.95,
    filename,
    invoice,
    scale = 3, // High DPI for crisp text
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(
      `Invoice element "#${elementId}" not found in document. Ensure the invoice preview is mounted.`
    );
  }

  const extension = format === "jpeg" ? "jpg" : "png";
  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

  const finalFilename =
    filename ||
    (invoice
      ? `${invoice.metadata.invoiceNumber || "Invoice"}_${
          invoice.recipient.companyName ||
          invoice.recipient.name ||
          "Client"
        }.${extension}`
          .replace(/[/\\?%*:|"<>]/g, "-")
          .replace(/\s+/g, "_")
      : `invoice.${extension}`);

  // Capture the canvas with html2canvas-pro
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: 1200,
    windowHeight: 1600,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        // Ensure element and all parent containers are visible with standard layout
        clonedElement.style.transform = "none";
        clonedElement.style.boxShadow = "none";
        clonedElement.style.margin = "0";
        clonedElement.style.display = "block";
        clonedElement.style.visibility = "visible";
        clonedElement.style.opacity = "1";
        clonedElement.style.width = "800px";
        clonedElement.style.maxWidth = "800px";

        let parent = clonedElement.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.transform = "none";
          parent.style.display = "block";
          parent.style.visibility = "visible";
          parent.style.opacity = "1";
          parent.style.maxHeight = "none";
          parent.style.overflow = "visible";
          parent = parent.parentElement;
        }
      }
    },
  });

  // Guard: Validate captured canvas dimensions
  if (
    !canvas ||
    canvas.width <= 0 ||
    canvas.height <= 0 ||
    !Number.isFinite(canvas.width) ||
    !Number.isFinite(canvas.height)
  ) {
    throw new Error(
      `Captured canvas has invalid dimensions (${canvas?.width ?? 0}x${canvas?.height ?? 0}). Element may have been unrendered or hidden during capture.`
    );
  }

  const dataUrl = canvas.toDataURL(mimeType, quality);
  if (!dataUrl || dataUrl === "data:,") {
    throw new Error(`Failed to generate ${format.toUpperCase()} image data URL from canvas.`);
  }

  // Trigger download
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
}
