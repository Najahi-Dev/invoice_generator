import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ClientDetails,
  CompanyDetails,
  CurrencyCode,
  DiscountType,
  InvoiceData,
  InvoiceDraftSummary,
  InvoiceMetadata,
  InvoiceSignature,
  LineItem,
  PaymentDetails,
  TaxCalculationMode,
  TemplateTheme,
} from "@/types/invoice";
import {
  calculateDueDate,
  calculateInvoiceSummary,
  calculateLineItemTotal,
  generateInvoiceNumber,
} from "@/lib/utils/calculations";
import { BLANK_INVOICE, DEFAULT_INVOICE } from "@/lib/sampleData";

interface InvoiceState {
  // Current active invoice
  invoice: InvoiceData;
  // History of saved drafts
  savedDrafts: InvoiceData[];
  // Active UI tab in mobile / workbench
  activeTab: "editor" | "preview";
  // Preview zoom level (percentage)
  previewZoom: number;

  // Actions
  setInvoice: (invoice: InvoiceData) => void;
  updateMetadata: (data: Partial<InvoiceMetadata>) => void;
  updateSender: (data: Partial<CompanyDetails>) => void;
  updateRecipient: (data: Partial<ClientDetails>) => void;
  updatePaymentDetails: (data: Partial<PaymentDetails>) => void;
  updateSignature: (data: Partial<InvoiceSignature>) => void;
  setTitle: (title: string) => void;
  setTheme: (theme: TemplateTheme) => void;
  setNotes: (notes: string) => void;
  setTerms: (terms: string) => void;
  setActiveTab: (tab: "editor" | "preview") => void;
  setPreviewZoom: (zoom: number | ((prev: number) => number)) => void;

  // Line items actions
  addLineItem: (item?: Partial<LineItem>) => void;
  updateLineItem: (id: string, item: Partial<LineItem>) => void;
  removeLineItem: (id: string) => void;
  duplicateLineItem: (id: string) => void;
  reorderLineItems: (items: LineItem[]) => void;

  // Financial summary actions
  setDiscount: (type: DiscountType, value: number) => void;
  setTaxMode: (mode: TaxCalculationMode) => void;
  setGlobalTaxRate: (rate: number) => void;
  setShippingFee: (fee: number) => void;
  setAmountPaid: (paid: number) => void;
  setCurrency: (currency: CurrencyCode) => void;

  // Drafts & presets
  saveCurrentDraft: (customName?: string) => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  getDraftsSummary: () => InvoiceDraftSummary[];
  loadSampleInvoice: () => void;
  resetInvoice: () => void;
  generateNewInvoiceNumber: () => void;
}

// Helper to recalculate summary on invoice state change
function recalculate(invoice: InvoiceData): InvoiceData {
  const recalculatedItems = invoice.items.map((item) => ({
    ...item,
    total: calculateLineItemTotal(item),
  }));

  const summary = calculateInvoiceSummary({
    items: recalculatedItems,
    discountType: invoice.summary.discountType,
    discountValue: invoice.summary.discountValue,
    taxMode: invoice.summary.taxMode,
    globalTaxRate: invoice.summary.globalTaxRate,
    shippingFee: invoice.summary.shippingFee,
    amountPaid: invoice.summary.amountPaid,
  });

  return {
    ...invoice,
    items: recalculatedItems,
    summary,
    updatedAt: new Date().toISOString(),
  };
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoice: DEFAULT_INVOICE,
      savedDrafts: [DEFAULT_INVOICE],
      activeTab: "editor",
      previewZoom: 100,

      setInvoice: (invoice) => set({ invoice: recalculate(invoice) }),

      updateMetadata: (data) =>
        set((state) => {
          const updatedMeta = { ...state.invoice.metadata, ...data };
          // If payment terms or issue date changed, recalculate due date automatically
          if (
            data.paymentTerms &&
            data.paymentTerms !== "custom" &&
            data.paymentTerms !== state.invoice.metadata.paymentTerms
          ) {
            updatedMeta.dueDate = calculateDueDate(
              updatedMeta.issueDate,
              data.paymentTerms
            );
          } else if (
            data.issueDate &&
            updatedMeta.paymentTerms !== "custom"
          ) {
            updatedMeta.dueDate = calculateDueDate(
              data.issueDate,
              updatedMeta.paymentTerms
            );
          }

          return {
            invoice: {
              ...state.invoice,
              metadata: updatedMeta,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      updateSender: (data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            sender: { ...state.invoice.sender, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),

      updateRecipient: (data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            recipient: { ...state.invoice.recipient, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),

      updatePaymentDetails: (data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            paymentDetails: { ...state.invoice.paymentDetails, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),

      updateSignature: (data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            signature: {
              type: state.invoice.signature?.type || "typed",
              ...state.invoice.signature,
              ...data,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      setTitle: (title) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            title,
            updatedAt: new Date().toISOString(),
          },
        })),

      setTheme: (theme) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            theme,
            updatedAt: new Date().toISOString(),
          },
        })),

      setNotes: (notes) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            notes,
            updatedAt: new Date().toISOString(),
          },
        })),

      setTerms: (terms) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            terms,
            updatedAt: new Date().toISOString(),
          },
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setPreviewZoom: (zoom) =>
        set((state) => ({
          previewZoom:
            typeof zoom === "function" ? zoom(state.previewZoom) : zoom,
        })),

      // Line items
      addLineItem: (item) =>
        set((state) => {
          const newItem: LineItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            description: item?.description ?? "",
            details: item?.details ?? "",
            quantity: item?.quantity ?? 1,
            unitPrice: item?.unitPrice ?? 0,
            taxRate: item?.taxRate ?? (state.invoice.summary.taxMode === "item" ? 10 : 0),
            discount: item?.discount ?? 0,
            total: 0,
          };
          newItem.total = calculateLineItemTotal(newItem);

          const updatedInvoice = {
            ...state.invoice,
            items: [...state.invoice.items, newItem],
          };

          return { invoice: recalculate(updatedInvoice) };
        }),

      updateLineItem: (id, itemUpdate) =>
        set((state) => {
          const updatedItems = state.invoice.items.map((item) => {
            if (item.id !== id) return item;
            const merged = { ...item, ...itemUpdate };
            return {
              ...merged,
              total: calculateLineItemTotal(merged),
            };
          });

          return {
            invoice: recalculate({
              ...state.invoice,
              items: updatedItems,
            }),
          };
        }),

      removeLineItem: (id) =>
        set((state) => {
          const filtered = state.invoice.items.filter((item) => item.id !== id);
          const finalItems =
            filtered.length > 0
              ? filtered
              : [
                  {
                    id: `item-${Date.now()}`,
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                  },
                ];

          return {
            invoice: recalculate({
              ...state.invoice,
              items: finalItems,
            }),
          };
        }),

      duplicateLineItem: (id) =>
        set((state) => {
          const targetIndex = state.invoice.items.findIndex(
            (item) => item.id === id
          );
          if (targetIndex === -1) return state;

          const target = state.invoice.items[targetIndex];
          const duplicated: LineItem = {
            ...target,
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            description: `${target.description} (Copy)`,
          };

          const newItems = [...state.invoice.items];
          newItems.splice(targetIndex + 1, 0, duplicated);

          return {
            invoice: recalculate({
              ...state.invoice,
              items: newItems,
            }),
          };
        }),

      reorderLineItems: (items) =>
        set((state) => ({
          invoice: recalculate({
            ...state.invoice,
            items,
          }),
        })),

      // Summary
      setDiscount: (type, value) =>
        set((state) => ({
          invoice: recalculate({
            ...state.invoice,
            summary: {
              ...state.invoice.summary,
              discountType: type,
              discountValue: Math.max(0, value),
            },
          }),
        })),

      setTaxMode: (taxMode) =>
        set((state) => ({
          invoice: recalculate({
            ...state.invoice,
            summary: {
              ...state.invoice.summary,
              taxMode,
            },
          }),
        })),

      setGlobalTaxRate: (globalTaxRate) =>
        set((state) => ({
          invoice: recalculate({
            ...state.invoice,
            summary: {
              ...state.invoice.summary,
              globalTaxRate: Math.max(0, globalTaxRate),
            },
          }),
        })),

      setShippingFee: (shippingFee) =>
        set((state) => ({
          invoice: recalculate({
            ...state.invoice,
            summary: {
              ...state.invoice.summary,
              shippingFee: Math.max(0, shippingFee),
            },
          }),
        })),

      setAmountPaid: (amountPaid) =>
        set((state) => ({
          invoice: recalculate({
            ...state.invoice,
            summary: {
              ...state.invoice.summary,
              amountPaid: Math.max(0, amountPaid),
            },
          }),
        })),

      setCurrency: (currency) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            metadata: {
              ...state.invoice.metadata,
              currency,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      // Drafts
      saveCurrentDraft: () =>
        set((state) => {
          const current = state.invoice;
          const existingIndex = state.savedDrafts.findIndex(
            (d) => d.id === current.id
          );

          let updatedDrafts: InvoiceData[];
          if (existingIndex >= 0) {
            updatedDrafts = [...state.savedDrafts];
            updatedDrafts[existingIndex] = current;
          } else {
            updatedDrafts = [current, ...state.savedDrafts];
          }

          return { savedDrafts: updatedDrafts };
        }),

      loadDraft: (id) =>
        set((state) => {
          const target = state.savedDrafts.find((d) => d.id === id);
          if (!target) return state;
          return { invoice: recalculate(target) };
        }),

      deleteDraft: (id) =>
        set((state) => ({
          savedDrafts: state.savedDrafts.filter((d) => d.id !== id),
        })),

      getDraftsSummary: () => {
        const { savedDrafts } = get();
        return savedDrafts.map((d) => ({
          id: d.id,
          invoiceNumber: d.metadata.invoiceNumber || "Untitled",
          clientName: d.recipient.name || d.recipient.companyName || "No Client",
          issueDate: d.metadata.issueDate,
          dueDate: d.metadata.dueDate,
          grandTotal: d.summary.grandTotal,
          currency: d.metadata.currency,
          updatedAt: d.updatedAt,
        }));
      },

      loadSampleInvoice: () =>
        set((state) => {
          const sample = {
            ...DEFAULT_INVOICE,
            id: `inv-${Date.now()}`,
          };
          return {
            invoice: recalculate(sample),
            savedDrafts: [sample, ...state.savedDrafts.filter((d) => d.id !== sample.id)],
          };
        }),

      resetInvoice: () =>
        set((state) => {
          const blank: InvoiceData = {
            ...BLANK_INVOICE,
            id: `inv-${Date.now()}`,
            metadata: {
              ...BLANK_INVOICE.metadata,
              invoiceNumber: generateInvoiceNumber("INV", state.savedDrafts.length + 1),
            },
          };
          return { invoice: recalculate(blank) };
        }),

      generateNewInvoiceNumber: () =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            metadata: {
              ...state.invoice.metadata,
              invoiceNumber: generateInvoiceNumber(
                "INV",
                Math.floor(Math.random() * 9000) + 1000
              ),
            },
            updatedAt: new Date().toISOString(),
          },
        })),
    }),
    {
      name: "global-invoice-store-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
