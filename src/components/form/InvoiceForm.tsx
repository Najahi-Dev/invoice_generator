"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SenderSection } from "./SenderSection";
import { RecipientSection } from "./RecipientSection";
import { MetadataSection } from "./MetadataSection";
import { LineItemsTable } from "./LineItemsTable";
import { SummarySection } from "./SummarySection";
import { PaymentNotesSection } from "./PaymentNotesSection";
import {
  Building2,
  User,
  FileSpreadsheet,
  ListPlus,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function InvoiceForm() {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({
    sender: false,
    recipient: false,
    meta: false,
    items: false,
    payment: false,
  });

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Invoice Metadata & Settings */}
      <Card>
        <CardHeader
          onClick={() => toggleSection("meta")}
          className="cursor-pointer hover:bg-zinc-50/70 transition-colors select-none"
        >
          <CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-zinc-700" />
            Invoice Details & Currency
          </CardTitle>
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-700 p-1"
            aria-label="Toggle section"
          >
            {collapsed.meta ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </CardHeader>
        {!collapsed.meta && (
          <CardContent>
            <MetadataSection />
          </CardContent>
        )}
      </Card>

      {/* 2. Sender & Recipient Columns */}
      <div className="grid grid-cols-1 gap-4">
        {/* Company / Sender */}
        <Card>
          <CardHeader
            onClick={() => toggleSection("sender")}
            className="cursor-pointer hover:bg-zinc-50/70 transition-colors select-none"
          >
            <CardTitle>
              <Building2 className="h-4 w-4 text-zinc-700" />
              Company / Sender Details
            </CardTitle>
            <button
              type="button"
              className="text-zinc-400 hover:text-zinc-700 p-1"
              aria-label="Toggle section"
            >
              {collapsed.sender ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {!collapsed.sender && (
            <CardContent>
              <SenderSection />
            </CardContent>
          )}
        </Card>

        {/* Client / Recipient */}
        <Card>
          <CardHeader
            onClick={() => toggleSection("recipient")}
            className="cursor-pointer hover:bg-zinc-50/70 transition-colors select-none"
          >
            <CardTitle>
              <User className="h-4 w-4 text-zinc-700" />
              Client / Recipient Details
            </CardTitle>
            <button
              type="button"
              className="text-zinc-400 hover:text-zinc-700 p-1"
              aria-label="Toggle section"
            >
              {collapsed.recipient ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {!collapsed.recipient && (
            <CardContent>
              <RecipientSection />
            </CardContent>
          )}
        </Card>
      </div>

      {/* 3. Line Items Table */}
      <Card>
        <CardHeader
          onClick={() => toggleSection("items")}
          className="cursor-pointer hover:bg-zinc-50/70 transition-colors select-none"
        >
          <CardTitle>
            <ListPlus className="h-4 w-4 text-zinc-700" />
            Line Items & Calculations
          </CardTitle>
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-700 p-1"
            aria-label="Toggle section"
          >
            {collapsed.items ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </CardHeader>
        {!collapsed.items && (
          <CardContent className="space-y-5">
            <LineItemsTable />
            <SummarySection />
          </CardContent>
        )}
      </Card>

      {/* 4. Payment Instructions & Notes */}
      <Card>
        <CardHeader
          onClick={() => toggleSection("payment")}
          className="cursor-pointer hover:bg-zinc-50/70 transition-colors select-none"
        >
          <CardTitle>
            <CreditCard className="h-4 w-4 text-zinc-700" />
            Payment Instructions, Notes & Terms
          </CardTitle>
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-700 p-1"
            aria-label="Toggle section"
          >
            {collapsed.payment ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </CardHeader>
        {!collapsed.payment && (
          <CardContent>
            <PaymentNotesSection />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
