export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "CNY"
  | "INR"
  | "AED"
  | "SGD"
  | "NZD"
  | "BRL"
  | "MXN"
  | "ZAR"
  | "HKD"
  | "SEK"
  | "NOK"
  | "DKK"
  | "KRW"
  | "TRY"
  | "SAR"
  | "PLN"
  | "THB"
  | "IDR"
  | "MYR"
  | "PHP"
  | "VND"
  | "ILS"
  | "NGN"
  | "LKR";

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  position: "prefix" | "suffix";
  decimals: number;
  locale: string;
}

export type PaymentTerms =
  | "due_on_receipt"
  | "net_7"
  | "net_15"
  | "net_30"
  | "net_45"
  | "net_60"
  | "net_90"
  | "custom";

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export type DiscountType = "percentage" | "fixed";

export type TaxCalculationMode = "item" | "global";

export type TemplateTheme =
  | "slate"
  | "indigo"
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "monochrome";

export interface CompanyDetails {
  name: string;
  logoUrl?: string;
  email: string;
  phone?: string;
  website?: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  taxId?: string; // Tax ID / VAT / GSTIN / EIN
}

export interface ClientDetails {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  taxId?: string; // Client Tax / VAT ID
}

export interface LineItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // per item tax percentage e.g. 10 for 10%
  discount?: number; // per item discount percentage e.g. 5 for 5%
  total: number;
}

export interface PaymentDetails {
  method: "bank_transfer" | "paypal" | "stripe" | "crypto" | "upi" | "custom";
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingOrSortCode?: string;
  iban?: string;
  swiftBic?: string;
  paymentLink?: string;
  upiId?: string;
  customInstructions?: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  poNumber?: string; // Purchase Order #
  paymentTerms: PaymentTerms;
  currency: CurrencyCode;
  status: InvoiceStatus;
}

export interface InvoiceSummary {
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  taxMode: TaxCalculationMode;
  globalTaxRate: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
}

export interface InvoiceSignature {
  type: "typed" | "image" | "none";
  typedName?: string;
  title?: string;
  imageUrl?: string;
  date?: string;
}

export interface InvoiceData {
  id: string;
  title: string; // e.g. "TAX INVOICE", "INVOICE", "PROFORMA INVOICE"
  metadata: InvoiceMetadata;
  sender: CompanyDetails;
  recipient: ClientDetails;
  items: LineItem[];
  summary: InvoiceSummary;
  paymentDetails: PaymentDetails;
  notes?: string;
  terms?: string;
  signature?: InvoiceSignature;
  theme: TemplateTheme;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceDraftSummary {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  grandTotal: number;
  currency: CurrencyCode;
  updatedAt: string;
}
