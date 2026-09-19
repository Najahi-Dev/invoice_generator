import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select2, Select2Option } from "@/components/ui/Select2";
import { DatePicker } from "@/components/ui/DatePicker";
import { Landmark, FileCheck, CreditCard } from "lucide-react";

export function PaymentNotesSection() {
  const {
    invoice,
    updatePaymentDetails,
    updateSignature,
    setNotes,
    setTerms,
  } = useInvoiceStore();
  const { paymentDetails, notes, terms, signature } = invoice;

  const paymentMethodOptions: Select2Option[] = [
    {
      value: "bank_transfer",
      label: "Direct Bank Transfer (Wire / ACH)",
      subLabel: "SWIFT, IBAN, Routing",
      badge: "Bank",
    },
    {
      value: "stripe",
      label: "Stripe / Online Checkout Link",
      subLabel: "Credit Card, Apple Pay",
      badge: "Card",
    },
    {
      value: "paypal",
      label: "PayPal",
      subLabel: "Instant checkout",
      badge: "PayPal",
    },
    {
      value: "upi",
      label: "UPI / Instant Transfer",
      subLabel: "VPA & QR",
      badge: "UPI",
    },
    {
      value: "crypto",
      label: "Cryptocurrency",
      subLabel: "BTC, ETH, USDT",
      badge: "Crypto",
    },
    {
      value: "custom",
      label: "Custom Instructions",
      subLabel: "Manual terms",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Payment Details Box */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-zinc-600" />
            Payment Instructions & Wire Details
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select2
            label="Payment Method"
            value={paymentDetails.method}
            onChange={(val) =>
              updatePaymentDetails({
                method: val as
                  | "bank_transfer"
                  | "paypal"
                  | "stripe"
                  | "crypto"
                  | "upi"
                  | "custom",
              })
            }
            options={paymentMethodOptions}
            prefixElement={<CreditCard className="h-3.5 w-3.5" />}
          />

          {paymentDetails.method === "bank_transfer" && (
            <Input
              label="Bank Name"
              placeholder="e.g. JPMorgan Chase Bank, N.A."
              value={paymentDetails.bankName || ""}
              onChange={(e) =>
                updatePaymentDetails({ bankName: e.target.value })
              }
            />
          )}

          {paymentDetails.method === "stripe" && (
            <Input
              label="Payment Link URL"
              placeholder="https://buy.stripe.com/..."
              value={paymentDetails.paymentLink || ""}
              onChange={(e) =>
                updatePaymentDetails({ paymentLink: e.target.value })
              }
            />
          )}

          {paymentDetails.method === "upi" && (
            <Input
              label="UPI ID / VPA"
              placeholder="username@bank"
              value={paymentDetails.upiId || ""}
              onChange={(e) =>
                updatePaymentDetails({ upiId: e.target.value })
              }
            />
          )}
        </div>

        {paymentDetails.method === "bank_transfer" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Account Holder Name"
                placeholder="Apex Engineering Labs Inc."
                value={paymentDetails.accountName || ""}
                onChange={(e) =>
                  updatePaymentDetails({ accountName: e.target.value })
                }
              />
              <Input
                label="Account Number / IBAN"
                placeholder="US00 0000 0000 0000"
                value={paymentDetails.accountNumber || ""}
                onChange={(e) =>
                  updatePaymentDetails({ accountNumber: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Routing Number / Sort Code"
                placeholder="121000358"
                value={paymentDetails.routingOrSortCode || ""}
                onChange={(e) =>
                  updatePaymentDetails({ routingOrSortCode: e.target.value })
                }
              />
              <Input
                label="SWIFT / BIC Code"
                placeholder="CHASUS33"
                value={paymentDetails.swiftBic || ""}
                onChange={(e) =>
                  updatePaymentDetails({ swiftBic: e.target.value })
                }
              />
            </div>
          </>
        )}

        <Input
          label="Additional Payment Reference / Notes"
          placeholder="e.g. Please include invoice number in wire memo."
          value={paymentDetails.customInstructions || ""}
          onChange={(e) =>
            updatePaymentDetails({ customInstructions: e.target.value })
          }
        />
      </div>

      {/* Notes and Terms Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
        <Textarea
          label="Notes to Client"
          placeholder="Thank you for your business! If you have any questions, feel free to reach out..."
          value={notes || ""}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <Textarea
          label="Terms & Conditions"
          placeholder="Payment due within 30 days. Standard interest rate applies to overdue invoices..."
          value={terms || ""}
          onChange={(e) => setTerms(e.target.value)}
          rows={3}
        />
      </div>

      {/* Signature Section */}
      <div className="pt-2 border-t border-zinc-100">
        <label className="text-[12px] font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <FileCheck className="h-3.5 w-3.5 text-zinc-600" />
          Authorized Signature
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Input
            label="Signer Full Name"
            placeholder="e.g. John Doe"
            value={signature?.typedName || ""}
            onChange={(e) =>
              updateSignature({
                type: "typed",
                typedName: e.target.value,
              })
            }
          />
          <Input
            label="Job Title / Role"
            placeholder="e.g. Managing Director"
            value={signature?.title || ""}
            onChange={(e) =>
              updateSignature({
                type: "typed",
                title: e.target.value,
              })
            }
          />
          <DatePicker
            label="Signing Date"
            value={signature?.date || ""}
            onChange={(dateStr) =>
              updateSignature({
                type: "typed",
                date: dateStr,
              })
            }
            placeholder="Select signing date"
          />
        </div>
      </div>
    </div>
  );
}

