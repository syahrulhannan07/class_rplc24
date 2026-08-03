"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import AnimateIn from "@/components/ui/AnimateIn";
import { toast } from "@/lib/toast";

type Item = { id: number; title: string; content: string; publishedAt: string; eventDate: string | null; eventTime: string | null; location: string | null };

export default function AdminPengumumanPage() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", publishedAt: "", eventDate: "", eventTime: "", location: "" });

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/pengumuman");
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
        const res = await fetch("/api/pengumuman");
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
    const now = new Date().toISOString().slice(0, 16);
    setForm({ title: "", content: "", publishedAt: now, eventDate: "", eventTime: "", location: "" });
    setModal(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({ title: item.title, content: item.content, publishedAt: item.publishedAt.slice(0, 16), eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "", eventTime: item.eventTime ?? "", location: item.location ?? "" });
    setModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/pengumuman/${editing.id}` : "/api/pengumuman";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { setModal(false); fetchData(); toast.success(editing ? "Pengumuman berhasil diperbarui" : "Pengumuman berhasil ditambahkan"); }
    } catch {
      toast.error("Gagal menyimpan data pengumuman");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pengumuman/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { fetchData(); toast.success("Pengumuman berhasil dihapus"); setDeleteTarget(null); }
      else toast.error(json.message || "Gagal menghapus pengumuman");
    } catch {
      toast.error("Gagal menghapus pengumuman");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Item>[] = [
    { key: "title", label: "Judul" },
    { key: "content", label: "Konten", render: (item) => item.content.length > 80 ? item.content.slice(0, 80) + "..." : item.content },
    { key: "publishedAt", label: "Publikasi", render: (item) => new Date(item.publishedAt).toLocaleDateString("id-ID") },
    {
      key: "eventDate",
      label: "Pelaksanaan",
      render: (item) => item.eventDate ? new Date(item.eventDate).toLocaleDateString("id-ID") : "—",
    },
    { key: "eventTime", label: "Waktu", render: (item) => item.eventTime || "—" },
    { key: "location", label: "Tempat", render: (item) => item.location || "—" },
  ];

  return (
    <div className="p-4 md:p-8">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brown uppercase tracking-tight">Kelola Pengumuman</h1>
            <p className="font-sans text-sm md:text-base text-brown-light mt-1">Atur pengumuman kelas</p>
          </div>
          <button onClick={openAdd} className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 uppercase tracking-tight hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 self-start">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </AnimateIn>
      <AnimateIn delay={100}>

      <AdminTable data={data} columns={columns} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </AnimateIn>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Pengumuman" : "Tambah Pengumuman"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Judul</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Konten</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow resize-none h-32" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Tanggal Publikasi</label>
            <input type="datetime-local" value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Tanggal Pelaksanaan (opsional)</label>
            <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Waktu Pelaksanaan (opsional)</label>
              <input type="time" value={form.eventTime} onChange={e => setForm({ ...form, eventTime: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
            </div>
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Tempat Pelaksanaan (opsional)</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="cth: Ruang 2C, Gedung A" className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3 disabled:opacity-50">
            {saving ? "Menyimpan..." : editing ? "SIMPAN" : "TAMBAH"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="HAPUS PENGUMUMAN"
        message={
          deleteTarget && (
            <>
              Yakin ingin menghapus pengumuman <b className="text-brown">{deleteTarget.title}</b>?
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