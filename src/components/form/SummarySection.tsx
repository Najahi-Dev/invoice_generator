import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";
import { DiscountType } from "@/types/invoice";

export function SummarySection() {
  const {
    invoice,
    setDiscount,
    setGlobalTaxRate,
    setShippingFee,
    setAmountPaid,
  } = useInvoiceStore();

  const { summary, metadata } = invoice;
  const isGlobalTax = summary.taxMode === "global";

  return (
    <div className="bg-zinc-50/80 border border-zinc-200/90 rounded-[4px] p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="text-[12px] font-semibold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-200">
        Payment & Totals Summary
      </div>

      <div className="space-y-2.5 text-xs">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-1">
          <span className="text-zinc-600 font-medium">Subtotal</span>
          <span className="font-semibold text-zinc-900 font-mono text-sm">
            {formatCurrency(summary.subtotal, metadata.currency)}
          </span>
        </div>

        {/* Discount Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-zinc-200/60">
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 font-medium">Discount</span>
            <div className="inline-flex bg-zinc-200/80 rounded-[3px] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setDiscount("percentage", summary.discountValue)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-[2px] transition-all cursor-pointer ${
                  summary.discountType === "percentage"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setDiscount("fixed", summary.discountValue)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-[2px] transition-all cursor-pointer ${
                  summary.discountType === "fixed"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Fixed
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="0"
              step="any"
              value={summary.discountValue || ""}
              placeholder="0"
              onChange={(e) =>
                setDiscount(
                  summary.discountType,
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-24 sm:w-20 h-8 sm:h-7 text-xs bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 rounded-[3px] px-2 text-right outline-none font-mono shadow-2xs"
            />
            <span className="font-semibold text-zinc-700 font-mono min-w-[80px] sm:w-28 text-right">
              -{formatCurrency(summary.discountAmount, metadata.currency)}
            </span>
          </div>
        </div>

        {/* Global Tax Rate (if global mode) */}
        {isGlobalTax ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-zinc-200/60">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 font-medium">Tax Rate (%)</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={summary.globalTaxRate || ""}
                placeholder="0"
                onChange={(e) =>
                  setGlobalTaxRate(parseFloat(e.target.value) || 0)
                }
                className="w-24 sm:w-20 h-8 sm:h-7 text-xs bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 rounded-[3px] px-2 text-right outline-none font-mono shadow-2xs"
              />
              <span className="font-semibold text-zinc-700 font-mono min-w-[80px] sm:w-28 text-right">
                {formatCurrency(summary.taxAmount, metadata.currency)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-1.5 border-t border-zinc-200/60">
            <span className="text-zinc-600 font-medium">Itemized Tax Total</span>
            <span className="font-semibold text-zinc-700 font-mono">
              {formatCurrency(summary.taxAmount, metadata.currency)}
            </span>
          </div>
        )}

        {/* Shipping / Extra Fees */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-zinc-200/60">
          <span className="text-zinc-600 font-medium">Shipping / Extra Fee</span>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="0"
              step="any"
              value={summary.shippingFee || ""}
              placeholder="0"
              onChange={(e) =>
                setShippingFee(parseFloat(e.target.value) || 0)
              }
              className="w-24 sm:w-20 h-8 sm:h-7 text-xs bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 rounded-[3px] px-2 text-right outline-none font-mono shadow-2xs"
            />
            <span className="font-semibold text-zinc-700 font-mono min-w-[80px] sm:w-28 text-right">
              {formatCurrency(summary.shippingFee, metadata.currency)}
            </span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between py-2.5 border-t border-zinc-300 text-sm font-bold text-zinc-900">
          <span className="tracking-tight">Grand Total</span>
          <span className="font-mono text-base font-bold text-zinc-950">
            {formatCurrency(summary.grandTotal, metadata.currency)}
          </span>
        </div>

        {/* Amount Paid & Balance Due */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-zinc-200/60">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-zinc-600 font-medium">Amount Already Paid</span>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAmountPaid(summary.grandTotal)}
                className="text-[10px] font-medium text-zinc-700 hover:text-zinc-950 px-2 py-1 rounded-[2px] bg-zinc-200/80 hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Mark full invoice amount as paid"
              >
                Paid in Full
              </button>
              {summary.amountPaid > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountPaid(0)}
                  className="text-[10px] font-medium text-rose-600 hover:text-rose-800 px-2 py-1 rounded-[2px] bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Clear amount paid"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="0"
              step="any"
              value={summary.amountPaid || ""}
              placeholder="0"
              onChange={(e) =>
                setAmountPaid(parseFloat(e.target.value) || 0)
              }
              className="w-24 sm:w-20 h-8 sm:h-7 text-xs bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 rounded-[3px] px-2 text-right outline-none font-mono shadow-2xs"
            />
            <span className="font-semibold text-emerald-700 font-mono min-w-[80px] sm:w-28 text-right">
              {formatCurrency(summary.amountPaid, metadata.currency)}
            </span>
          </div>
        </div>

        {summary.amountPaid > summary.grandTotal && (
          <div className="flex items-center justify-between py-1.5 text-xs text-amber-800 font-medium bg-amber-50/80 px-2.5 rounded-[3px] border border-amber-200">
            <span>Change / Refund Due:</span>
            <span className="font-mono font-semibold">
              {formatCurrency(summary.amountPaid - summary.grandTotal, metadata.currency)}
            </span>
          </div>
        )}

        {/* Balance Due */}
        <div
          className={`flex items-center justify-between py-2 text-white rounded-[4px] px-3.5 mt-1.5 transition-all shadow-xs ${
            summary.amountPaid >= summary.grandTotal && summary.grandTotal > 0
              ? "bg-emerald-700"
              : "bg-zinc-950"
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {summary.amountPaid >= summary.grandTotal && summary.grandTotal > 0
              ? "Status: Paid in Full"
              : "Balance Due"}
          </span>
          <span className="text-sm font-bold font-mono">
            {formatCurrency(summary.balanceDue, metadata.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
