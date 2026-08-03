"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import AnimateIn from "@/components/ui/AnimateIn";
import { toast } from "@/lib/toast";

type Item = { id: number; eventName: string; eventDate: string; eventTime: string | null; location: string | null; description: string | null };

export default function AdminKalenderPage() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ eventName: "", eventDate: "", eventTime: "", location: "", description: "" });

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/kalender");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/kalender");
        const json = await res.json();
        if (json.success && !cancelled) setData(json.data);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ eventName: "", eventDate: "", eventTime: "", location: "", description: "" });
    setModal(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({ eventName: item.eventName, eventDate: item.eventDate.slice(0, 10), eventTime: item.eventTime ?? "", location: item.location ?? "", description: item.description ?? "" });
    setModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, eventTime: form.eventTime || null };
      const url = editing ? `/api/kalender/${editing.id}` : "/api/kalender";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) { setModal(false); fetchData(); toast.success(editing ? "Acara berhasil diperbarui" : "Acara berhasil ditambahkan"); }
    } catch {
      toast.error("Gagal menyimpan data acara");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/kalender/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { fetchData(); toast.success("Acara berhasil dihapus"); setDeleteTarget(null); }
      else toast.error(json.message || "Gagal menghapus acara");
    } catch {
      toast.error("Gagal menghapus acara");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Item>[] = [
    { key: "eventName", label: "Acara" },
    { key: "eventDate", label: "Tanggal", render: (item) => new Date(item.eventDate).toLocaleDateString("id-ID") },
    { key: "eventTime", label: "Waktu" },
    { key: "location", label: "Lokasi" },
  ];

  return (
    <div className="p-4 md:p-8">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brown uppercase tracking-tight">Kelola Kalender</h1>
            <p className="font-sans text-sm md:text-base text-brown-light mt-1">Atur acara dan agenda kelas</p>
          </div>
          <button onClick={openAdd} className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 uppercase tracking-tight hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 self-start">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </AnimateIn>
      <AnimateIn delay={100}>

      <AdminTable data={data} columns={columns} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </AnimateIn>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Acara" : "Tambah Acara"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Nama Acara</label>
            <input value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Tanggal</label>
            <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Waktu (opsional)</label>
            <input type="time" value={form.eventTime} onChange={e => setForm({ ...form, eventTime: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Lokasi (opsional)</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Deskripsi (opsional)</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow resize-none h-24" />
          </div>
          <button type="submit" disabled={saving} className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3 disabled:opacity-50">
            {saving ? "Menyimpan..." : editing ? "SIMPAN" : "TAMBAH"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="HAPUS ACARA"
        message={
          deleteTarget && (
            <>
              Yakin ingin menghapus acara <b className="text-brown">{deleteTarget.eventName}</b>?
              <br /> Tindakan ini tidak bisa dibatalkan.
            </>
          )
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}