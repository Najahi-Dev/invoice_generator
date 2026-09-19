import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company or sender name is required"),
  logoUrl: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  taxId: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Client or contact name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  taxId: z.string().optional(),
});

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  details: z.string().optional(),
  quantity: z.number().min(0.01, "Quantity must be > 0"),
  unitPrice: z.number().min(0, "Unit price must be >= 0"),
  taxRate: z.number().min(0).max(100).optional(),
  discount: z.number().min(0).max(100).optional(),
  total: z.number(),
});

export const paymentDetailsSchema = z.object({
  method: z.enum([
    "bank_transfer",
    "paypal",
    "stripe",
    "crypto",
    "upi",
    "custom",
  ]),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingOrSortCode: z.string().optional(),
  iban: z.string().optional(),
  swiftBic: z.string().optional(),
  paymentLink: z.string().optional(),
  upiId: z.string().optional(),
  customInstructions: z.string().optional(),
});

export const invoiceMetadataSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  poNumber: z.string().optional(),
  paymentTerms: z.enum([
    "due_on_receipt",
    "net_7",
    "net_15",
    "net_30",
    "net_45",
    "net_60",
    "net_90",
    "custom",
  ]),
  currency: z.string().min(1),
  status: z.enum(["draft", "pending", "paid", "overdue"]),
});

export const invoiceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Invoice title is required"),
  metadata: invoiceMetadataSchema,
  sender: companySchema,
  recipient: clientSchema,
  items: z.array(lineItemSchema).min(1, "At least one line item is required"),
  summary: z.object({
    subtotal: z.number(),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(0),
    discountAmount: z.number(),
    taxMode: z.enum(["item", "global"]),
    globalTaxRate: z.number().min(0).max(100),
    taxAmount: z.number(),
    shippingFee: z.number().min(0),
    grandTotal: z.number(),
    amountPaid: z.number().min(0),
    balanceDue: z.number(),
  }),
  paymentDetails: paymentDetailsSchema,
  notes: z.string().optional(),
  terms: z.string().optional(),
  theme: z.enum([
    "slate",
    "indigo",
    "emerald",
    "blue",
    "violet",
    "amber",
    "rose",
    "monochrome",
  ]),
});
