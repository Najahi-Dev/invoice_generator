import {
  DiscountType,
  InvoiceSummary,
  LineItem,
  TaxCalculationMode,
} from "@/types/invoice";

export function calculateLineItemTotal(item: Partial<LineItem>): number {
  const quantity = Math.max(0, item.quantity ?? 0);
  const unitPrice = Math.max(0, item.unitPrice ?? 0);
  const discount = Math.min(100, Math.max(0, item.discount ?? 0));
  const taxRate = Math.max(0, item.taxRate ?? 0);

  const baseTotal = quantity * unitPrice;
  const afterDiscount = baseTotal * (1 - discount / 100);
  const total = afterDiscount * (1 + taxRate / 100);

  return Number(total.toFixed(2));
}

export function calculateInvoiceSummary(params: {
  items: LineItem[];
  discountType: DiscountType;
  discountValue: number;
  taxMode: TaxCalculationMode;
  globalTaxRate: number;
  shippingFee: number;
  amountPaid: number;
}): InvoiceSummary {
  const {
    items,
    discountType,
    discountValue,
    taxMode,
    globalTaxRate,
    shippingFee,
    amountPaid,
  } = params;

  // 1. Calculate raw subtotal from items before item-level taxes
  let subtotal = 0;
  let itemTaxTotal = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity || 0);
    const price = Math.max(0, item.unitPrice || 0);
    const itemDiscount = Math.min(100, Math.max(0, item.discount || 0));
    const itemTax = Math.max(0, item.taxRate || 0);

    const base = qty * price;
    const discounted = base * (1 - itemDiscount / 100);
    subtotal += discounted;

    if (taxMode === "item") {
      itemTaxTotal += discounted * (itemTax / 100);
    }
  }

  subtotal = Number(subtotal.toFixed(2));

  // 2. Calculate overall discount
  let discountAmount = 0;
  const safeDiscountVal = Math.max(0, discountValue || 0);

  if (discountType === "percentage") {
    const percent = Math.min(100, safeDiscountVal);
    discountAmount = Number(((subtotal * percent) / 100).toFixed(2));
  } else {
    // Fixed amount
    discountAmount = Number(Math.min(subtotal, safeDiscountVal).toFixed(2));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // 3. Calculate tax
  let finalTaxAmount = 0;
  if (taxMode === "global") {
    const safeTaxRate = Math.max(0, globalTaxRate || 0);
    finalTaxAmount = Number(((taxableAmount * safeTaxRate) / 100).toFixed(2));
  } else {
    finalTaxAmount = Number(itemTaxTotal.toFixed(2));
  }

  // 4. Shipping & Grand Total
  const safeShipping = Math.max(0, shippingFee || 0);
  const grandTotal = Number(
    (taxableAmount + finalTaxAmount + safeShipping).toFixed(2)
  );

  // 5. Balance Due
  const safeAmountPaid = Math.max(0, amountPaid || 0);
  const balanceDue = Number(Math.max(0, grandTotal - safeAmountPaid).toFixed(2));

  return {
    subtotal,
    discountType,
    discountValue: safeDiscountVal,
    discountAmount,
    taxMode,
    globalTaxRate: Math.max(0, globalTaxRate || 0),
    taxAmount: finalTaxAmount,
    shippingFee: safeShipping,
    grandTotal,
    amountPaid: safeAmountPaid,
    balanceDue,
  };
}

export function generateInvoiceNumber(prefix = "INV", sequence = 1): string {
  const currentYear = new Date().getFullYear();
  const paddedSeq = sequence.toString().padStart(4, "0");
  return `${prefix}-${currentYear}-${paddedSeq}`;
}

export function calculateDueDate(
  issueDateStr: string,
  terms: string,
  customDays?: number
): string {
  try {
    const issueDate = new Date(issueDateStr || new Date());
    if (isNaN(issueDate.getTime())) return issueDateStr;

    let daysToAdd = 0;
    switch (terms) {
      case "due_on_receipt":
        daysToAdd = 0;
        break;
      case "net_7":
        daysToAdd = 7;
        break;
      case "net_15":
        daysToAdd = 15;
        break;
      case "net_30":
        daysToAdd = 30;
        break;
      case "net_45":
        daysToAdd = 45;
        break;
      case "net_60":
        daysToAdd = 60;
        break;
      case "net_90":
        daysToAdd = 90;
        break;
      case "custom":
        daysToAdd = customDays ?? 30;
        break;
      default:
        daysToAdd = 30;
    }

    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    return dueDate.toISOString().split("T")[0];
  } catch {
    return issueDateStr;
  }
}
