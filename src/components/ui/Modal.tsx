"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-brown/50" onClick={onClose} />
      <div
        ref={ref}
        className="relative bg-white brutal-box w-full max-w-lg max-h-[90vh] overflow-y-auto animate-popup"
      >
        <div className="flex items-center justify-between border-b-3 border-brown px-6 py-4 bg-kelas-yellow">
          <h2 className="font-display font-bold text-xl text-brown uppercase tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="brutal-box-sm w-8 h-8 bg-white flex items-center justify-center hover:bg-kelas-pink transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}