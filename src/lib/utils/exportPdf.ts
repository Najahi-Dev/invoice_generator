import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { InvoiceData } from "@/types/invoice";

export interface ExportPdfOptions {
  elementId?: string;
  filename?: string;
  invoice?: InvoiceData;
  scale?: number;
}

export async function exportInvoiceToPdf(
  options: ExportPdfOptions = {}
): Promise<boolean> {
  const {
    elementId = "invoice-preview-document",
    filename,
    invoice,
    scale = 2.5,
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(
      `Invoice element "#${elementId}" not found in document. Ensure the invoice preview is mounted.`
    );
  }

  // Generate filename based on invoice meta
  const finalFilename =
    filename ||
    (invoice
      ? `${invoice.metadata.invoiceNumber || "Invoice"}_${
          invoice.recipient.companyName ||
          invoice.recipient.name ||
          "Client"
        }.pdf`
          .replace(/[/\\?%*:|"<>]/g, "-")
          .replace(/\s+/g, "_")
      : "invoice.pdf");

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

  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  // Calculate proportional height
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  // Guard: Validate computed numeric dimensions before passing to jsPDF
  if (
    !Number.isFinite(pdfWidth) ||
    !Number.isFinite(imgHeight) ||
    pdfWidth <= 0 ||
    imgHeight <= 0
  ) {
    throw new Error(
      `Invalid computed PDF image dimensions: pdfWidth=${pdfWidth}, imgHeight=${imgHeight}. Aborting to prevent jsPDF.scale crash.`
    );
  }

  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  if (!imgData || imgData === "data:,") {
    throw new Error("Failed to generate image data URL from canvas.");
  }

  // Check if single page fits
  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
  } else {
    // Multi-page rendering if needed
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      if (!Number.isFinite(position)) {
        throw new Error(`Invalid page position (${position}) calculated during multi-page PDF generation.`);
      }
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  }

  pdf.save(finalFilename);
  return true;
}
