import React from "react";
import { InvoiceData, TemplateTheme } from "@/types/invoice";
import { formatCurrency } from "@/lib/utils/currency";

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  id?: string;
}

// Theme color definitions for borders, accents and highlights
const THEME_STYLES: Record<
  TemplateTheme,
  {
    primary: string;
    primaryBg: string;
    primaryText: string;
    borderAccent: string;
    headerBg: string;
    tableHeaderBg: string;
  }
> = {
  indigo: {
    primary: "text-indigo-600",
    primaryBg: "bg-indigo-600",
    primaryText: "text-white",
    borderAccent: "border-indigo-600",
    headerBg: "bg-indigo-50/50",
    tableHeaderBg: "bg-indigo-950 text-white",
  },
  slate: {
    primary: "text-slate-800",
    primaryBg: "bg-slate-800",
    primaryText: "text-white",
    borderAccent: "border-slate-800",
    headerBg: "bg-slate-50",
    tableHeaderBg: "bg-slate-900 text-white",
  },
  emerald: {
    primary: "text-emerald-600",
    primaryBg: "bg-emerald-600",
    primaryText: "text-white",
    borderAccent: "border-emerald-600",
    headerBg: "bg-emerald-50/50",
    tableHeaderBg: "bg-emerald-950 text-white",
  },
  blue: {
    primary: "text-blue-600",
    primaryBg: "bg-blue-600",
    primaryText: "text-white",
    borderAccent: "border-blue-600",
    headerBg: "bg-blue-50/50",
    tableHeaderBg: "bg-blue-950 text-white",
  },
  violet: {
    primary: "text-violet-600",
    primaryBg: "bg-violet-600",
    primaryText: "text-white",
    borderAccent: "border-violet-600",
    headerBg: "bg-violet-50/50",
    tableHeaderBg: "bg-violet-950 text-white",
  },
  amber: {
    primary: "text-amber-600",
    primaryBg: "bg-amber-600",
    primaryText: "text-white",
    borderAccent: "border-amber-600",
    headerBg: "bg-amber-50/50",
    tableHeaderBg: "bg-amber-950 text-white",
  },
  rose: {
    primary: "text-rose-600",
    primaryBg: "bg-rose-600",
    primaryText: "text-white",
    borderAccent: "border-rose-600",
    headerBg: "bg-rose-50/50",
    tableHeaderBg: "bg-rose-950 text-white",
  },
  monochrome: {
    primary: "text-zinc-900",
    primaryBg: "bg-zinc-950",
    primaryText: "text-white",
    borderAccent: "border-zinc-950",
    headerBg: "bg-zinc-100",
    tableHeaderBg: "bg-zinc-900 text-white",
  },
};

export function InvoiceTemplate({
  invoice,
  id = "invoice-preview-document",
}: InvoiceTemplateProps) {
  const {
    title,
    metadata,
    sender,
    recipient,
    items,
    summary,
    paymentDetails,
    notes,
    terms,
    signature,
    theme = "indigo",
  } = invoice;

  const currentTheme = THEME_STYLES[theme] || THEME_STYLES.indigo;
  const currency = metadata.currency || "USD";

  return (
    <div
      id={id}
      className="w-full bg-white text-zinc-900 mx-auto shadow-sm border border-zinc-200/80 rounded-[4px] p-6 sm:p-10 font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:w-full select-text transition-all min-h-[842px] flex flex-col justify-between"
      style={{
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Top Header Row: Logo & Invoice Title */}
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-zinc-200">
          {/* Sender Logo or Name */}
          <div className="flex items-center gap-3.5">
            {sender.logoUrl ? (
              <div className="h-14 w-14 max-h-16 max-w-28 flex items-center justify-start overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sender.logoUrl}
                  alt={sender.name || "Company Logo"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : null}
            <div>
              <h1 className="text-lg font-bold text-zinc-900 tracking-tight leading-tight">
                {sender.name || "Your Business Name"}
              </h1>
              {sender.taxId && (
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  Tax ID / VAT: {sender.taxId}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Title & Meta summary */}
          <div className="text-right">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-900">
              {title || "INVOICE"}
            </h2>
            <div className="mt-1.5 inline-flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500 font-medium">
                #{metadata.invoiceNumber || "INV-0001"}
              </span>
            </div>
          </div>
        </div>

        {/* Sender & Recipient Columns + Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-6 border-b border-zinc-200 text-xs">
          {/* Sender Details */}
          <div className="sm:col-span-4 space-y-1">
            <div className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
              From
            </div>
            <div className="font-semibold text-zinc-900">
              {sender.name || "Sender Name"}
            </div>
            {sender.address && (
              <div className="text-zinc-600 leading-relaxed">
                {sender.address}
              </div>
            )}
            {(sender.city || sender.state || sender.postalCode) && (
              <div className="text-zinc-600">
                {[sender.city, sender.state, sender.postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}
            {sender.country && (
              <div className="text-zinc-600">{sender.country}</div>
            )}
            {sender.email && (
              <div className="text-zinc-600 pt-0.5">{sender.email}</div>
            )}
            {sender.phone && (
              <div className="text-zinc-600">{sender.phone}</div>
            )}
          </div>

          {/* Recipient Details */}
          <div className="sm:col-span-4 space-y-1">
            <div className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
              Billed To
            </div>
            <div className="font-semibold text-zinc-900">
              {recipient.name || "Client Name"}
            </div>
            {recipient.companyName && (
              <div className="text-zinc-700 font-medium">
                {recipient.companyName}
              </div>
            )}
            {recipient.address && (
              <div className="text-zinc-600 leading-relaxed">
                {recipient.address}
              </div>
            )}
            {(recipient.city || recipient.state || recipient.postalCode) && (
              <div className="text-zinc-600">
                {[recipient.city, recipient.state, recipient.postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}
            {recipient.country && (
              <div className="text-zinc-600">{recipient.country}</div>
            )}
            {recipient.email && (
              <div className="text-zinc-600 pt-0.5">{recipient.email}</div>
            )}
            {recipient.taxId && (
              <div className="text-zinc-500 font-mono text-[10px]">
                VAT / Tax ID: {recipient.taxId}
              </div>
            )}
          </div>

          {/* Invoice Dates & Terms */}
          <div className="sm:col-span-4 space-y-2 bg-zinc-50/70 p-3 rounded-[4px] border border-zinc-200/70">
            <div className="flex justify-between">
              <span className="text-zinc-500">Invoice Date:</span>
              <span className="font-medium text-zinc-900 font-mono">
                {metadata.issueDate || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Payment Due:</span>
              <span className="font-semibold text-zinc-900 font-mono">
                {metadata.dueDate || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Terms:</span>
              <span className="font-medium text-zinc-800 capitalize">
                {metadata.paymentTerms.replace("_", " ")}
              </span>
            </div>
            {metadata.poNumber && (
              <div className="flex justify-between border-t border-zinc-200/60 pt-1.5">
                <span className="text-zinc-500">PO Number:</span>
                <span className="font-mono text-zinc-800">
                  {metadata.poNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`${currentTheme.tableHeaderBg} text-white font-semibold rounded-[3px]`}>
                  <th className="py-2.5 px-3 rounded-l-[3px] w-8 text-center font-mono">
                    #
                  </th>
                  <th className="py-2.5 px-3">Item & Description</th>
                  <th className="py-2.5 px-3 text-right w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-24">Rate</th>
                  {summary.taxMode === "item" && (
                    <th className="py-2.5 px-3 text-right w-16">Tax</th>
                  )}
                  <th className="py-2.5 px-3 text-right w-28 rounded-r-[3px]">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80">
                {items.map((item, index) => (
                  <tr key={item.id} className="align-top hover:bg-zinc-50/50">
                    <td className="py-3 px-3 text-center text-zinc-400 font-mono text-[11px]">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-900">
                        {item.description || "Untitled Item"}
                      </div>
                      {item.details && (
                        <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                          {item.details}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-800">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-800">
                      {formatCurrency(item.unitPrice, currency)}
                    </td>
                    {summary.taxMode === "item" && (
                      <td className="py-3 px-3 text-right font-mono text-zinc-500">
                        {item.taxRate ? `${item.taxRate}%` : "-"}
                      </td>
                    )}
                    <td className="py-3 px-3 text-right font-semibold font-mono text-zinc-900">
                      {formatCurrency(item.total, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary & Payment Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 pb-6 border-b border-zinc-200">
          {/* Left Column: Bank / Payment Transfer Info */}
          <div className="sm:col-span-7 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Payment Instructions
            </div>

            {paymentDetails.method === "bank_transfer" && (
              <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-[4px] p-3 text-xs space-y-1">
                {paymentDetails.bankName && (
                  <div className="flex">
                    <span className="text-zinc-500 w-28 shrink-0">Bank:</span>
                    <span className="font-medium text-zinc-900">
                      {paymentDetails.bankName}
                    </span>
                  </div>
                )}
                {paymentDetails.accountName && (
                  <div className="flex">
                    <span className="text-zinc-500 w-28 shrink-0">Account Name:</span>
                    <span className="font-medium text-zinc-900">
                      {paymentDetails.accountName}
                    </span>
                  </div>
                )}
                {paymentDetails.accountNumber && (
                  <div className="flex">
                    <span className="text-zinc-500 w-28 shrink-0">Account No:</span>
                    <span className="font-mono text-zinc-900">
                      {paymentDetails.accountNumber}
                    </span>
                  </div>
                )}
                {paymentDetails.iban && (
                  <div className="flex">
                    <span className="text-zinc-500 w-28 shrink-0">IBAN:</span>
                    <span className="font-mono text-zinc-900">
                      {paymentDetails.iban}
                    </span>
                  </div>
                )}
                {paymentDetails.swiftBic && (
                  <div className="flex">
                    <span className="text-zinc-500 w-28 shrink-0">SWIFT / BIC:</span>
                    <span className="font-mono text-zinc-900">
                      {paymentDetails.swiftBic}
                    </span>
                  </div>
                )}
              </div>
            )}

            {paymentDetails.method === "stripe" && paymentDetails.paymentLink && (
              <div className="bg-zinc-50 p-2.5 rounded-[4px] border border-zinc-200 text-xs">
                <span className="text-zinc-500 block mb-0.5">Pay Online:</span>
                <a
                  href={paymentDetails.paymentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-blue-600 hover:underline break-all"
                >
                  {paymentDetails.paymentLink}
                </a>
              </div>
            )}

            {paymentDetails.method === "upi" && paymentDetails.upiId && (
              <div className="bg-zinc-50 p-2.5 rounded-[4px] border border-zinc-200 text-xs">
                <span className="text-zinc-500">UPI VPA:</span>{" "}
                <span className="font-mono font-medium text-zinc-900">
                  {paymentDetails.upiId}
                </span>
              </div>
            )}

            {paymentDetails.customInstructions && (
              <div className="text-[11px] text-zinc-600 leading-relaxed">
                {paymentDetails.customInstructions}
              </div>
            )}
          </div>

          {/* Right Column: Financial Totals Box */}
          <div className="sm:col-span-5 space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-zinc-600">Subtotal:</span>
              <span className="font-medium font-mono text-zinc-900">
                {formatCurrency(summary.subtotal, currency)}
              </span>
            </div>

            {summary.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>
                  Discount{" "}
                  {summary.discountType === "percentage"
                    ? `(${summary.discountValue}%)`
                    : ""}
                  :
                </span>
                <span className="font-medium font-mono text-zinc-800">
                  -{formatCurrency(summary.discountAmount, currency)}
                </span>
              </div>
            )}

            {summary.taxAmount > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>
                  Tax{" "}
                  {summary.taxMode === "global" && summary.globalTaxRate > 0
                    ? `(${summary.globalTaxRate}%)`
                    : ""}
                  :
                </span>
                <span className="font-medium font-mono text-zinc-800">
                  {formatCurrency(summary.taxAmount, currency)}
                </span>
              </div>
            )}

            {summary.shippingFee > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Shipping / Extra:</span>
                <span className="font-medium font-mono text-zinc-800">
                  {formatCurrency(summary.shippingFee, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 border-t border-zinc-300 text-sm font-bold text-zinc-900">
              <span>Grand Total:</span>
              <span className="font-mono">
                {formatCurrency(summary.grandTotal, currency)}
              </span>
            </div>

            {summary.amountPaid > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Amount Paid:</span>
                <span className="font-medium font-mono text-emerald-600">
                  {formatCurrency(summary.amountPaid, currency)}
                </span>
              </div>
            )}

            {summary.amountPaid > summary.grandTotal && (
              <div className="flex justify-between py-1 text-amber-700 font-medium">
                <span>Change / Refund:</span>
                <span className="font-mono">
                  {formatCurrency(summary.amountPaid - summary.grandTotal, currency)}
                </span>
              </div>
            )}

            <div
              className={`flex justify-between py-2 px-3 rounded-[3px] font-bold text-xs ${
                summary.amountPaid >= summary.grandTotal && summary.grandTotal > 0
                  ? "bg-emerald-700 text-white"
                  : `${currentTheme.primaryBg} text-white`
              }`}
            >
              <span className="uppercase tracking-wider">
                {summary.amountPaid >= summary.grandTotal && summary.grandTotal > 0
                  ? "Status: Paid in Full"
                  : "Balance Due:"}
              </span>
              <span className="font-mono text-sm">
                {formatCurrency(summary.balanceDue, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes & Terms Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 text-[11px] text-zinc-600">
          <div className="sm:col-span-8 space-y-2">
            {notes && (
              <div>
                <div className="font-semibold uppercase tracking-wider text-zinc-400 text-[10px]">
                  Notes
                </div>
                <div className="text-zinc-600 leading-relaxed mt-0.5 whitespace-pre-line">
                  {notes}
                </div>
              </div>
            )}
            {terms && (
              <div className="pt-2">
                <div className="font-semibold uppercase tracking-wider text-zinc-400 text-[10px]">
                  Terms & Conditions
                </div>
                <div className="text-zinc-500 leading-relaxed mt-0.5 whitespace-pre-line text-[10px]">
                  {terms}
                </div>
              </div>
            )}
          </div>

          {/* Signature Block */}
          <div className="sm:col-span-4 flex flex-col justify-end text-right">
            {signature?.typedName && (
              <div className="space-y-1">
                <div className="font-serif italic text-base text-zinc-800 border-b border-zinc-300 pb-1 inline-block min-w-[140px]">
                  {signature.typedName}
                </div>
                <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                  {signature.title || "Authorized Signatory"}
                </div>
                {signature.date && (
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {signature.date}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer watermark / bottom note */}
      <div className="pt-8 text-center text-[10px] text-zinc-400 border-t border-zinc-100 mt-6">
        Generated with Global Invoice Generator • Thank you for your business
      </div>
    </div>
  );
}
