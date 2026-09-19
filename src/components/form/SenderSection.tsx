import React, { useRef } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Input } from "@/components/ui/Input";
import { Upload, X, Building2, Globe, Mail, Phone } from "lucide-react";

export function SenderSection() {
  const { invoice, updateSender } = useInvoiceStore();
  const { sender } = invoice;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateSender({ logoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    updateSender({ logoUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Logo and Primary Sender Identification */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Logo Uploader */}
        <div className="w-full sm:w-44 shrink-0">
          <label className="text-xs font-medium text-zinc-700 block mb-1">
            Company Logo
          </label>
          {sender.logoUrl ? (
            <div className="relative group border border-zinc-200 rounded-[4px] p-2 bg-zinc-50 flex items-center justify-center h-24 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sender.logoUrl}
                alt="Uploaded company logo"
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute top-1 right-1 bg-zinc-900/80 hover:bg-rose-600 text-white p-1 rounded-sm transition-colors opacity-80 group-hover:opacity-100"
                title="Remove logo"
                aria-label="Remove logo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-zinc-300 hover:border-zinc-500 rounded-[4px] p-3 bg-zinc-50/60 hover:bg-zinc-100/50 flex flex-col items-center justify-center h-24 text-center cursor-pointer transition-colors"
            >
              <Upload className="h-5 w-5 text-zinc-400 mb-1" />
              <span className="text-[11px] font-medium text-zinc-600">
                Upload Logo
              </span>
              <span className="text-[10px] text-zinc-400">
                PNG, JPG or SVG (&lt;2MB)
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Company Name & Tax ID */}
        <div className="flex-1 w-full space-y-2.5">
          <Input
            label="Your Business / Company Name"
            placeholder="e.g. Acme Corporation LLC"
            value={sender.name}
            onChange={(e) => updateSender({ name: e.target.value })}
            prefixElement={<Building2 className="h-3.5 w-3.5" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="billing@company.com"
              value={sender.email}
              onChange={(e) => updateSender({ email: e.target.value })}
              prefixElement={<Mail className="h-3.5 w-3.5" />}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={sender.phone || ""}
              onChange={(e) => updateSender({ phone: e.target.value })}
              prefixElement={<Phone className="h-3.5 w-3.5" />}
            />
          </div>
        </div>
      </div>

      {/* Address Fields */}
      <div className="space-y-2.5 pt-1">
        <Input
          label="Street Address"
          placeholder="123 Innovation Way, Suite 400"
          value={sender.address}
          onChange={(e) => updateSender({ address: e.target.value })}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="col-span-1 sm:col-span-2">
            <Input
              label="City"
              placeholder="San Francisco"
              value={sender.city}
              onChange={(e) => updateSender({ city: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="State / Province"
              placeholder="CA"
              value={sender.state || ""}
              onChange={(e) => updateSender({ state: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Postal / Zip Code"
              placeholder="94105"
              value={sender.postalCode || ""}
              onChange={(e) => updateSender({ postalCode: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <Input
              label="Country"
              placeholder="United States"
              value={sender.country}
              onChange={(e) => updateSender({ country: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Tax ID / VAT / GSTIN"
              placeholder="e.g. US-EIN-12-3456789"
              value={sender.taxId || ""}
              onChange={(e) => updateSender({ taxId: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Website"
              placeholder="https://acme.com"
              value={sender.website || ""}
              onChange={(e) => updateSender({ website: e.target.value })}
              prefixElement={<Globe className="h-3.5 w-3.5" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
