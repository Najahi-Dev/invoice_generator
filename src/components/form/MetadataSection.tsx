import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CURRENCY_LIST } from "@/lib/utils/currency";
import { CurrencyCode, PaymentTerms } from "@/types/invoice";
import { RefreshCw, Calendar, Hash, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MetadataSection() {
  const {
    invoice,
    updateMetadata,
    setTitle,
    generateNewInvoiceNumber,
    setCurrency,
  } = useInvoiceStore();
  const { metadata, title } = invoice;

  const paymentTermsOptions: { value: PaymentTerms; label: string }[] = [
    { value: "due_on_receipt", label: "Due on Receipt" },
    { value: "net_7", label: "Net 7 Days" },
    { value: "net_15", label: "Net 15 Days" },
    { value: "net_30", label: "Net 30 Days" },
    { value: "net_45", label: "Net 45 Days" },
    { value: "net_60", label: "Net 60 Days" },
    { value: "net_90", label: "Net 90 Days" },
    { value: "custom", label: "Custom Due Date" },
  ];

  return (
    <div className="space-y-3">
      {/* Title & Currency Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Document Title"
          placeholder="TAX INVOICE / INVOICE"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="w-full">
          <Select
            label="Currency"
            value={metadata.currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            prefixElement={<DollarSign className="h-3.5 w-3.5" />}
          >
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Invoice # & PO # */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-zinc-700 select-none flex items-center justify-between mb-1">
            <span>Invoice Number</span>
            <button
              type="button"
              onClick={generateNewInvoiceNumber}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-normal cursor-pointer"
              title="Generate new invoice number"
            >
              <RefreshCw className="h-3 w-3" /> Auto-gen
            </button>
          </label>
          <Input
            placeholder="INV-2026-0001"
            value={metadata.invoiceNumber}
            onChange={(e) => updateMetadata({ invoiceNumber: e.target.value })}
            prefixElement={<Hash className="h-3.5 w-3.5" />}
          />
        </div>

        <Input
          label="PO Number (Optional)"
          placeholder="PO-2026-981"
          value={metadata.poNumber || ""}
          onChange={(e) => updateMetadata({ poNumber: e.target.value })}
        />
      </div>

      {/* Dates and Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Issue Date"
          type="date"
          value={metadata.issueDate}
          onChange={(e) => updateMetadata({ issueDate: e.target.value })}
          prefixElement={<Calendar className="h-3.5 w-3.5" />}
        />

        <Select
          label="Payment Terms"
          value={metadata.paymentTerms}
          onChange={(e) =>
            updateMetadata({ paymentTerms: e.target.value as PaymentTerms })
          }
        >
          {paymentTermsOptions.map((term) => (
            <option key={term.value} value={term.value}>
              {term.label}
            </option>
          ))}
        </Select>

        <Input
          label="Due Date"
          type="date"
          value={metadata.dueDate}
          onChange={(e) => updateMetadata({ dueDate: e.target.value })}
          prefixElement={<Calendar className="h-3.5 w-3.5" />}
        />
      </div>
    </div>
  );
}
