"use client";

import { useEffect } from "react";
import { X, Trash2 } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title = "HAPUS DATA",
  message,
  confirmLabel = "HAPUS",
  cancelLabel = "BATAL",
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-brown/60 backdrop-blur-sm"
        onClick={() => {
          if (!busy) onClose();
        }}
      />
      <div className="relative bg-white brutal-box w-full max-w-md animate-popup">
        <div className="flex items-center justify-between border-b-3 border-brown px-6 py-4 bg-kelas-pink">
          <h2 className="font-display font-bold text-xl text-brown uppercase tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="brutal-box-sm w-8 h-8 bg-white flex items-center justify-center hover:bg-kelas-yellow transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className="brutal-box-sm bg-kelas-pink w-16 h-16 mx-auto flex items-center justify-center mb-4 animate-wobble">
            <Trash2 size={30} strokeWidth={2} className="text-brown" />
          </div>

          <div className="text-center font-sans text-sm md:text-base text-brown-light leading-relaxed mb-6">
            {message}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex-1 brutal-btn bg-cream text-brown font-display font-bold text-sm py-3 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="flex-1 brutal-btn bg-kelas-pink text-brown font-display font-bold text-sm py-3 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {busy ? "MENGHAPUS..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}