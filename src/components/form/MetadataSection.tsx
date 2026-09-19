import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Input } from "@/components/ui/Input";
import { Select2 } from "@/components/ui/Select2";
import { DatePicker } from "@/components/ui/DatePicker";
import { CURRENCY_LIST } from "@/lib/utils/currency";
import { CurrencyCode, PaymentTerms } from "@/types/invoice";
import { RefreshCw, Hash, DollarSign, Clock } from "lucide-react";

export function MetadataSection() {
  const {
    invoice,
    updateMetadata,
    setTitle,
    generateNewInvoiceNumber,
    setCurrency,
  } = useInvoiceStore();
  const { metadata, title } = invoice;

  const currencyOptions = CURRENCY_LIST.map((c) => ({
    value: c.code,
    label: `${c.code} - ${c.name}`,
    badge: c.symbol,
  }));

  const paymentTermsOptions: { value: PaymentTerms; label: string; subLabel?: string }[] = [
    { value: "due_on_receipt", label: "Due on Receipt" },
    { value: "net_7", label: "Net 7 Days", subLabel: "+7 days" },
    { value: "net_15", label: "Net 15 Days", subLabel: "+15 days" },
    { value: "net_30", label: "Net 30 Days", subLabel: "+30 days" },
    { value: "net_45", label: "Net 45 Days", subLabel: "+45 days" },
    { value: "net_60", label: "Net 60 Days", subLabel: "+60 days" },
    { value: "net_90", label: "Net 90 Days", subLabel: "+90 days" },
    { value: "custom", label: "Custom Due Date" },
  ];

  return (
    <div className="space-y-3.5">
      {/* Title & Currency Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Input
          label="Document Title"
          placeholder="TAX INVOICE / INVOICE"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="w-full">
          <Select2
            label="Currency"
            value={metadata.currency}
            onChange={(val) => setCurrency(val as CurrencyCode)}
            options={currencyOptions}
            searchPlaceholder="Search currency by name or code (e.g. USD, EUR, LKR)..."
            prefixElement={<DollarSign className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Invoice # & PO # */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="text-[12px] font-medium text-zinc-700 select-none flex items-center justify-between mb-1.5">
            <span>Invoice Number</span>
            <button
              type="button"
              onClick={generateNewInvoiceNumber}
              className="text-[11px] text-zinc-500 hover:text-zinc-950 flex items-center gap-1 font-normal cursor-pointer transition-colors"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <DatePicker
          label="Issue Date"
          value={metadata.issueDate}
          onChange={(dateStr) => updateMetadata({ issueDate: dateStr })}
          placeholder="Select issue date"
        />

        <Select2
          label="Payment Terms"
          value={metadata.paymentTerms}
          onChange={(val) => updateMetadata({ paymentTerms: val as PaymentTerms })}
          options={paymentTermsOptions}
          prefixElement={<Clock className="h-3.5 w-3.5" />}
        />

        <DatePicker
          label="Due Date"
          value={metadata.dueDate}
          onChange={(dateStr) => updateMetadata({ dueDate: dateStr })}
          placeholder="Select due date"
        />
      </div>
    </div>
  );
}

