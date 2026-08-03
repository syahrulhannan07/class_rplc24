"use client";

import { Pencil, Trash2, Inbox } from "lucide-react";
import LoadingNeo from "@/components/ui/LoadingNeo";

export type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  loading?: boolean;
};

export default function AdminTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  loading,
}: Props<T>) {
  if (loading) {
    return <LoadingNeo variant="card" message="Memuat data..." />;
  }

  if (data.length === 0) {
    return (
      <div className="brutal-box bg-white p-10 text-center">
        <div className="w-16 h-16 mx-auto brutal-box-sm bg-beige flex items-center justify-center mb-4">
          <Inbox size={32} strokeWidth={1.5} />
        </div>
        <p className="font-serif text-xl text-brown-light">Belum ada data.</p>
        <p className="font-sans text-sm text-brown-light mt-2">Klik tombol &ldquo;Tambah&rdquo; untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="brutal-box bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-3 border-brown bg-kelas-yellow">
              {columns.map((col) => (
                <th key={col.key} className="font-display font-bold text-sm text-brown uppercase tracking-tight px-4 py-3.5">
                  {col.label}
                </th>
              ))}
              <th className="font-display font-bold text-sm text-brown uppercase tracking-tight px-4 py-3.5 w-24 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={item.id}
                className={`border-b border-brown/20 hover:bg-light-pink/40 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-cream/50"
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 font-sans text-sm text-brown">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="brutal-box-sm w-8 h-8 bg-kelas-yellow flex items-center justify-center hover:scale-105 hover:bg-kelas-pink transition-all"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="brutal-box-sm w-8 h-8 bg-kelas-pink flex items-center justify-center hover:scale-105 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}