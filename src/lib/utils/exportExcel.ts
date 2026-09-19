import * as XLSX from "xlsx";
import { InvoiceData } from "@/types/invoice";
import { formatCurrency } from "./currency";

export function exportInvoiceToExcel(invoice: InvoiceData, customFilename?: string): boolean {
  try {
    const wb = XLSX.utils.book_new();

    const invoiceNo = invoice.metadata.invoiceNumber || "INV-000";
    const currency = invoice.metadata.currency || "USD";

    // Build worksheet data array
    const wsData: (string | number | undefined)[][] = [
      // Header
      [invoice.title || "INVOICE", "", "", "", "", ""],
      ["", "", "", "", "", ""],

      // Company info
      ["FROM (SENDER):", "", "", "INVOICE DETAILS:", "", ""],
      [invoice.sender.name || "N/A", "", "", "Invoice Number:", invoiceNo, ""],
      [invoice.sender.address || "", "", "", "Issue Date:", invoice.metadata.issueDate, ""],
      [
        `${invoice.sender.city || ""}${invoice.sender.state ? ", " + invoice.sender.state : ""} ${invoice.sender.postalCode || ""}`,
        "",
        "",
        "Due Date:",
        invoice.metadata.dueDate,
        "",
      ],
      [invoice.sender.country || "", "", "", "Payment Terms:", invoice.metadata.paymentTerms.replace("_", " ").toUpperCase(), ""],
      [invoice.sender.email ? `Email: ${invoice.sender.email}` : "", "", "", "PO Number:", invoice.metadata.poNumber || "N/A", ""],
      [invoice.sender.taxId ? `Tax ID: ${invoice.sender.taxId}` : "", "", "", "Currency:", currency, ""],
      ["", "", "", "", "", ""],

      // Client info
      ["BILL TO (CLIENT):", "", "", "", "", ""],
      [invoice.recipient.name || "N/A", "", "", "", "", ""],
      [invoice.recipient.companyName || "", "", "", "", "", ""],
      [invoice.recipient.address || "", "", "", "", "", ""],
      [
        `${invoice.recipient.city || ""}${invoice.recipient.state ? ", " + invoice.recipient.state : ""} ${invoice.recipient.postalCode || ""}`,
        "",
        "",
        "",
        "",
        "",
      ],
      [invoice.recipient.country || "", "", "", "", "", ""],
      [invoice.recipient.email ? `Email: ${invoice.recipient.email}` : "", "", "", "", "", ""],
      [invoice.recipient.taxId ? `Tax ID: ${invoice.recipient.taxId}` : "", "", "", "", "", ""],
      ["", "", "", "", "", ""],

      // Line items table header
      [
        "#",
        "Description",
        "Qty",
        `Unit Price (${currency})`,
        "Tax Rate (%)",
        `Total (${currency})`,
      ],
    ];

    // Append Line Items
    invoice.items.forEach((item, index) => {
      wsData.push([
        index + 1,
        item.description + (item.details ? ` - ${item.details}` : ""),
        item.quantity,
        item.unitPrice,
        item.taxRate ? `${item.taxRate}%` : "0%",
        item.total,
      ]);
    });

    // Spacing
    wsData.push(["", "", "", "", "", ""]);

    // Summary Section
    wsData.push(["", "", "", "Subtotal:", invoice.summary.subtotal, ""]);
    if (invoice.summary.discountAmount > 0) {
      wsData.push([
        "",
        "",
        "",
        `Discount (${invoice.summary.discountType === "percentage" ? invoice.summary.discountValue + "%" : "Fixed"}):`,
        -invoice.summary.discountAmount,
        "",
      ]);
    }
    if (invoice.summary.taxAmount > 0) {
      wsData.push([
        "",
        "",
        "",
        `Tax Total:`,
        invoice.summary.taxAmount,
        "",
      ]);
    }
    if (invoice.summary.shippingFee > 0) {
      wsData.push(["", "", "", "Shipping / Extra:", invoice.summary.shippingFee, ""]);
    }
    wsData.push(["", "", "", "GRAND TOTAL:", invoice.summary.grandTotal, ""]);
    if (invoice.summary.amountPaid > 0) {
      wsData.push(["", "", "", "Amount Paid:", invoice.summary.amountPaid, ""]);
      wsData.push(["", "", "", "BALANCE DUE:", invoice.summary.balanceDue, ""]);
    }

    // Spacing
    wsData.push(["", "", "", "", "", ""]);

    // Payment details
    wsData.push(["PAYMENT INSTRUCTIONS:", "", "", "", "", ""]);
    if (invoice.paymentDetails.method === "bank_transfer") {
      if (invoice.paymentDetails.bankName) wsData.push([`Bank Name: ${invoice.paymentDetails.bankName}`]);
      if (invoice.paymentDetails.accountName) wsData.push([`Account Name: ${invoice.paymentDetails.accountName}`]);
      if (invoice.paymentDetails.accountNumber) wsData.push([`Account Number: ${invoice.paymentDetails.accountNumber}`]);
      if (invoice.paymentDetails.routingOrSortCode) wsData.push([`Routing / Sort Code: ${invoice.paymentDetails.routingOrSortCode}`]);
      if (invoice.paymentDetails.iban) wsData.push([`IBAN: ${invoice.paymentDetails.iban}`]);
      if (invoice.paymentDetails.swiftBic) wsData.push([`SWIFT / BIC: ${invoice.paymentDetails.swiftBic}`]);
    }
    if (invoice.paymentDetails.customInstructions) {
      wsData.push([`Notes: ${invoice.paymentDetails.customInstructions}`]);
    }

    // Notes and Terms
    if (invoice.notes) {
      wsData.push(["", "", "", "", "", ""]);
      wsData.push(["NOTES:", "", "", "", "", ""]);
      wsData.push([invoice.notes]);
    }
    if (invoice.terms) {
      wsData.push(["", "", "", "", "", ""]);
      wsData.push(["TERMS & CONDITIONS:", "", "", "", "", ""]);
      wsData.push([invoice.terms]);
    }

    // Create Worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set Column Widths for readability
    ws["!cols"] = [
      { wch: 6 },  // #
      { wch: 45 }, // Description
      { wch: 12 }, // Qty
      { wch: 18 }, // Unit Price
      { wch: 15 }, // Tax Rate
      { wch: 18 }, // Line Total
    ];

    // Append sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");

    // Output filename
    const filename =
      customFilename ||
      `${invoiceNo}_${invoice.recipient.companyName || invoice.recipient.name || "Client"}.xlsx`
        .replace(/[/\\?%*:|"<>]/g, "-")
        .replace(/\s+/g, "_");

    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
}
