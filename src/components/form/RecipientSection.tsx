import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Input } from "@/components/ui/Input";
import { User, Building, Mail, Phone } from "lucide-react";

export function RecipientSection() {
  const { invoice, updateRecipient } = useInvoiceStore();
  const { recipient } = invoice;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Client Name / Contact Person"
          placeholder="e.g. Jane Doe"
          value={recipient.name}
          onChange={(e) => updateRecipient({ name: e.target.value })}
          prefixElement={<User className="h-3.5 w-3.5" />}
        />
        <Input
          label="Client Company Name (Optional)"
          placeholder="e.g. Stark Industries LLC"
          value={recipient.companyName || ""}
          onChange={(e) => updateRecipient({ companyName: e.target.value })}
          prefixElement={<Building className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Client Email"
          type="email"
          placeholder="client@company.com"
          value={recipient.email}
          onChange={(e) => updateRecipient({ email: e.target.value })}
          prefixElement={<Mail className="h-3.5 w-3.5" />}
        />
        <Input
          label="Client Phone (Optional)"
          placeholder="+1 (555) 123-4567"
          value={recipient.phone || ""}
          onChange={(e) => updateRecipient({ phone: e.target.value })}
          prefixElement={<Phone className="h-3.5 w-3.5" />}
        />
      </div>

      <Input
        label="Billing Address"
        placeholder="456 Corporate Blvd, Floor 12"
        value={recipient.address}
        onChange={(e) => updateRecipient({ address: e.target.value })}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="col-span-1 sm:col-span-2">
          <Input
            label="City"
            placeholder="New York"
            value={recipient.city}
            onChange={(e) => updateRecipient({ city: e.target.value })}
          />
        </div>
        <div>
          <Input
            label="State / Province"
            placeholder="NY"
            value={recipient.state || ""}
            onChange={(e) => updateRecipient({ state: e.target.value })}
          />
        </div>
        <div>
          <Input
            label="Postal / Zip Code"
            placeholder="10001"
            value={recipient.postalCode || ""}
            onChange={(e) => updateRecipient({ postalCode: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Country"
          placeholder="United States"
          value={recipient.country}
          onChange={(e) => updateRecipient({ country: e.target.value })}
        />
        <Input
          label="Client Tax ID / VAT (Optional)"
          placeholder="e.g. EU-VAT-987654321"
          value={recipient.taxId || ""}
          onChange={(e) => updateRecipient({ taxId: e.target.value })}
        />
      </div>
    </div>
  );
}
