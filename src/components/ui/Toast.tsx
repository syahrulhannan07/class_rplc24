"use client";

import { useState, useEffect, useCallback } from "react";
import { subscribe, dismissToast, type ToastItem } from "@/lib/toast";
import { CheckCircle, XCircle, X } from "lucide-react";

function ToastCard({ item }: { item: ToastItem }) {
  const [exiting, setExiting] = useState(false);
  const isSuccess = item.type === "success";

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => dismissToast(item.id), 250);
  }, [item.id]);

  return (
    <div
      className={
        "flex items-start gap-3 brutal-box-sm bg-white px-4 py-3 max-w-sm w-full " +
        (isSuccess ? "border-3 border-green-600" : "border-3 border-red-600") +
        " " +
        (exiting ? "animate-popup-out" : "animate-popup")
      }
      role="alert"
    >
      <div className={`shrink-0 mt-0.5 p-1 ${isSuccess ? "bg-green-100" : "bg-red-100"} border-2 border-brown`}>
        {isSuccess ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
      </div>
      <p className="font-sans text-sm text-brown flex-1 leading-snug">{item.message}</p>
      <button
        onClick={handleClose}
        className="shrink-0 text-brown-light hover:text-brown transition-colors mt-0.5 hover:rotate-90 transition-transform duration-200"
        aria-label="Tutup"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribe(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastCard item={item} />
        </div>
      ))}
    </div>
  );
}
