import { InvoiceData } from "@/types/invoice";
import { calculateInvoiceSummary, calculateLineItemTotal } from "./utils/calculations";

// A clean minimalist SVG logo as base64 data URI
export const SAMPLE_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' rx='20' fill='%230f172a'/><path d='M30 70 L50 25 L70 70 L55 70 L50 55 L45 70 Z' fill='%23ffffff'/><circle cx='50' cy='45' r='5' fill='%236366f1'/></svg>";

const sampleItems = [
  {
    id: "item-1",
    description: "Cloud Architecture & System Design",
    details: "High-availability multi-region infrastructure blueprint, Terraform automation & IAM security posture",
    quantity: 1,
    unitPrice: 3800,
    taxRate: 10,
    discount: 0,
    total: 0,
  },
  {
    id: "item-2",
    description: "Full-Stack SaaS Platform Implementation",
    details: "Next.js 15 frontend, serverless edge functions, real-time analytics streaming and Stripe billing integration",
    quantity: 65,
    unitPrice: 120,
    taxRate: 10,
    discount: 5,
    total: 0,
  },
  {
    id: "item-3",
    description: "Enterprise Security Audit & Performance Tuning",
    details: "OWASP vulnerability assessment, database query profiling, and 99.99% SLA benchmark verification",
    quantity: 1,
    unitPrice: 2200,
    taxRate: 10,
    discount: 0,
    total: 0,
  },
];

const computedItems = sampleItems.map((item) => ({
  ...item,
  total: calculateLineItemTotal(item),
}));

const initialSummary = calculateInvoiceSummary({
  items: computedItems,
  discountType: "percentage",
  discountValue: 0,
  taxMode: "item",
  globalTaxRate: 10,
  shippingFee: 0,
  amountPaid: 0,
});

export const DEFAULT_INVOICE: InvoiceData = {
  id: "inv-initial-sample",
  title: "TAX INVOICE",
  metadata: {
    invoiceNumber: "INV-2026-0842",
    issueDate: "2026-09-15",
    dueDate: "2026-10-15",
    poNumber: "PO-US-89410",
    paymentTerms: "net_30",
    currency: "USD",
    status: "pending",
  },
  sender: {
    name: "Apex Engineering Labs Inc.",
    logoUrl: SAMPLE_LOGO,
    email: "billing@apexengineering.io",
    phone: "+1 (415) 890-4320",
    website: "https://apexengineering.io",
    address: "548 Market Street, Suite 9200",
    city: "San Francisco",
    state: "CA",
    postalCode: "94104",
    country: "United States",
    taxId: "US-EIN-94-3829103",
  },
  recipient: {
    name: "Alex Morgan",
    companyName: "Vanguard Global Technologies",
    email: "accounts.payable@vanguardglobal.com",
    phone: "+1 (212) 555-0199",
    address: "350 5th Avenue, 48th Floor",
    city: "New York",
    state: "NY",
    postalCode: "10118",
    country: "United States",
    taxId: "US-EIN-13-9028471",
  },
  items: computedItems,
  summary: initialSummary,
  paymentDetails: {
    method: "bank_transfer",
    bankName: "Silicon Valley Bank / First Citizens",
    accountName: "Apex Engineering Labs Inc.",
    accountNumber: "948201948201",
    routingOrSortCode: "121140399",
    iban: "US94SVB0121140399000000",
    swiftBic: "SVBUS6S",
    paymentLink: "https://pay.apexengineering.io/inv-2026-0842",
    customInstructions: "Please include invoice number INV-2026-0842 as the wire transfer reference.",
  },
  notes: "Thank you for partnering with Apex Engineering Labs. For any questions regarding this invoice or service scope, contact billing@apexengineering.io.",
  terms: "Payment is due within 30 days of invoice date. Late payments may accrue a service charge of 1.5% per month. Wire transfer fees must be borne by the remitter.",
  signature: {
    type: "typed",
    typedName: "Elena Rostova",
    title: "Chief Financial Officer",
    date: "2026-09-15",
  },
  theme: "indigo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const BLANK_INVOICE: InvoiceData = {
  id: "inv-blank",
  title: "INVOICE",
  metadata: {
    invoiceNumber: "INV-2026-0001",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    paymentTerms: "net_30",
    currency: "USD",
    status: "draft",
  },
  sender: {
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
  },
  recipient: {
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
  },
  items: [
    {
      id: "item-1",
      description: "Service or Product Description",
      quantity: 1,
      unitPrice: 100,
      taxRate: 0,
      discount: 0,
      total: 100,
    },
  ],
  summary: {
    subtotal: 100,
    discountType: "percentage",
    discountValue: 0,
    discountAmount: 0,
    taxMode: "global",
    globalTaxRate: 0,
    taxAmount: 0,
    shippingFee: 0,
    grandTotal: 100,
    amountPaid: 0,
    balanceDue: 100,
  },
  paymentDetails: {
    method: "bank_transfer",
    customInstructions: "",
  },
  notes: "Thank you for your business!",
  terms: "Payment is due according to the agreed terms.",
  signature: {
    type: "none",
  },
  theme: "slate",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
