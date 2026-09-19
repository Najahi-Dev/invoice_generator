import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Copy, Percent, Layers } from "lucide-react";
import { LineItem } from "@/types/invoice";

export function LineItemsTable() {
  const {
    invoice,
    addLineItem,
    updateLineItem,
    removeLineItem,
    duplicateLineItem,
    setTaxMode,
  } = useInvoiceStore();
  const { items, summary, metadata } = invoice;
  const isItemTax = summary.taxMode === "item";

  const handleNumericChange = (
    id: string,
    field: keyof LineItem,
    value: string
  ) => {
    const num = parseFloat(value);
    updateLineItem(id, {
      [field]: isNaN(num) ? 0 : num,
    });
  };

  return (
    <div className="space-y-3">
      {/* Header with Tax mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            Items & Services ({items.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-500 hidden sm:inline">Tax Mode:</span>
          <button
            type="button"
            onClick={() => setTaxMode(isItemTax ? "global" : "item")}
            className={`px-2 py-0.5 text-xs rounded-[3px] border transition-colors flex items-center gap-1 cursor-pointer ${
              isItemTax
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            <Percent className="h-3 w-3" />
            {isItemTax ? "Per-Item Tax" : "Global Tax"}
          </button>
        </div>
      </div>

      {/* Line Items List */}
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 bg-zinc-50/80 border border-zinc-200/90 rounded-[4px] space-y-2 transition-all hover:border-zinc-300"
          >
            {/* Top row: Item description & action buttons */}
            <div className="flex items-start gap-2">
              <span className="text-xs font-mono font-medium text-zinc-400 mt-2 shrink-0 w-4 text-center">
                {index + 1}
              </span>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="Item or service description *"
                  value={item.description}
                  onChange={(e) =>
                    updateLineItem(item.id, { description: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm font-medium bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-[4px] px-2.5 py-1.5 outline-none"
                />
                <input
                  type="text"
                  placeholder="Additional details / specifications (Optional)"
                  value={item.details || ""}
                  onChange={(e) =>
                    updateLineItem(item.id, { details: e.target.value })
                  }
                  className="w-full text-xs bg-white text-zinc-600 placeholder:text-zinc-400 border border-zinc-200 focus:border-zinc-900 rounded-[4px] px-2.5 py-1 outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => duplicateLineItem(item.id)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-[3px] transition-colors"
                  title="Duplicate row"
                  aria-label="Duplicate row"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeLineItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-[3px] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-colors"
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom row: Quantity, Rate, Discount, Tax, and Row Total */}
            <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 pt-1 border-t border-zinc-200/60 items-center">
              {/* Quantity */}
              <div className="col-span-1 sm:col-span-3">
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-0.5">
                  Qty
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={item.quantity}
                  onChange={(e) =>
                    handleNumericChange(item.id, "quantity", e.target.value)
                  }
                  className="w-full h-8 text-xs bg-white text-zinc-900 border border-zinc-300 focus:border-zinc-900 rounded-[4px] px-2 text-right outline-none font-mono"
                />
              </div>

              {/* Unit Price */}
              <div className="col-span-1 sm:col-span-3">
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-0.5">
                  Unit Price
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleNumericChange(item.id, "unitPrice", e.target.value)
                  }
                  className="w-full h-8 text-xs bg-white text-zinc-900 border border-zinc-300 focus:border-zinc-900 rounded-[4px] px-2 text-right outline-none font-mono"
                />
              </div>

              {/* Optional Item Tax */}
              {isItemTax && (
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-0.5">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={item.taxRate ?? 0}
                    onChange={(e) =>
                      handleNumericChange(item.id, "taxRate", e.target.value)
                    }
                    className="w-full h-8 text-xs bg-white text-zinc-900 border border-zinc-300 focus:border-zinc-900 rounded-[4px] px-2 text-right outline-none font-mono"
                  />
                </div>
              )}

              {/* Item Total Display */}
              <div
                className={`col-span-1 ${
                  isItemTax ? "sm:col-span-4" : "sm:col-span-6"
                } text-right`}
              >
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-0.5">
                  Line Total
                </label>
                <div className="h-8 flex items-center justify-end font-semibold text-xs text-zinc-900 font-mono bg-zinc-100/70 border border-zinc-200/80 rounded-[4px] px-2">
                  {formatCurrency(item.total, metadata.currency)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Row Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addLineItem()}
        className="w-full border-dashed border-zinc-300 hover:border-zinc-500 hover:bg-zinc-50 text-xs py-2"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Line Item
      </Button>
    </div>
  );
}
