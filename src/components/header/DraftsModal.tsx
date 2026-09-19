import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";
import { Button } from "@/components/ui/Button";
import { FileText, Trash2, Download, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface DraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DraftsModal({ isOpen, onClose }: DraftsModalProps) {
  const {
    savedDrafts,
    invoice,
    loadDraft,
    deleteDraft,
    saveCurrentDraft,
    resetInvoice,
  } = useInvoiceStore();

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveCurrent = () => {
    saveCurrentDraft();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleLoad = (id: string) => {
    loadDraft(id);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this invoice draft?")) {
      deleteDraft(id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Invoices & Drafts"
      description="Invoices are stored locally in your browser so you never lose your progress."
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium">
            {savedDrafts.length} {savedDrafts.length === 1 ? "draft" : "drafts"} saved
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveCurrent}
              className="text-xs h-8 px-2.5"
            >
              {savedNotice ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Saved Current!
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Save Active
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                resetInvoice();
                onClose();
              }}
              className="text-xs h-8 px-2.5"
            >
              <Plus className="h-3.5 w-3.5" />
              New Invoice
            </Button>
          </div>
        </div>

        {savedDrafts.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No saved drafts found yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-[50vh] overflow-y-auto">
            {savedDrafts.map((draft) => {
              const isActive = draft.id === invoice.id;
              const formattedTotal = formatCurrency(
                draft.summary.grandTotal,
                draft.metadata.currency
              );

              return (
                <div
                  key={draft.id}
                  onClick={() => handleLoad(draft.id)}
                  className={`p-2.5 sm:p-3 rounded-[4px] flex items-center justify-between gap-2 transition-colors cursor-pointer hover:bg-zinc-50 ${
                    isActive ? "bg-zinc-100/70 border border-zinc-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-[4px] bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-600 font-mono text-xs font-semibold">
                      {draft.metadata.currency}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-xs text-zinc-900 truncate">
                          {draft.metadata.invoiceNumber || "Untitled"}
                        </span>
                        {isActive && (
                          <Badge variant="default" size="sm">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {draft.recipient.companyName || draft.recipient.name || "No client"}
                        {" • "}
                        {draft.metadata.issueDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-zinc-900 font-mono">
                        {formattedTotal}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {draft.items.length} {draft.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, draft.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors cursor-pointer"
                      title="Delete draft"
                      aria-label="Delete draft"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
