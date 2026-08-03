"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, GitBranch, Briefcase } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import AnimateIn from "@/components/ui/AnimateIn";
import { toast } from "@/lib/toast";

type Item = { id: number; name: string; githubUrl: string | null; linkedinUrl: string | null; photoUrl: string | null; contact: string | null };

export default function AdminAnggotaPage() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: "", githubUrl: "", linkedinUrl: "", contact: "" });

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/anggota");
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
        const res = await fetch("/api/anggota");
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
    setForm({ name: "", githubUrl: "", linkedinUrl: "", contact: "" });
    setModal(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({ name: item.name, githubUrl: item.githubUrl ?? "", linkedinUrl: item.linkedinUrl ?? "", contact: item.contact ?? "" });
    setModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/anggota/${editing.id}` : "/api/anggota";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { setModal(false); fetchData(); toast.success(editing ? "Anggota berhasil diperbarui" : "Anggota berhasil ditambahkan"); }
    } catch {
      toast.error("Gagal menyimpan data anggota");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/anggota/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { fetchData(); toast.success("Anggota berhasil dihapus"); setDeleteTarget(null); }
      else toast.error(json.message || "Gagal menghapus anggota");
    } catch {
      toast.error("Gagal menghapus anggota");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Item>[] = [
    { key: "name", label: "Nama" },
    {
      key: "githubUrl",
      label: "GitHub",
      render: (item) =>
        item.githubUrl ? (
          <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brown hover:underline break-all">
            <GitBranch size={14} className="shrink-0" /> {item.githubUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
        ) : (
          <span className="text-brown-light">—</span>
        ),
    },
    {
      key: "linkedinUrl",
      label: "LinkedIn",
      render: (item) =>
        item.linkedinUrl ? (
          <a href={item.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-kelas-purple hover:underline break-all">
            <Briefcase size={14} className="shrink-0" /> {item.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
        ) : (
          <span className="text-brown-light">—</span>
        ),
    },
    { key: "contact", label: "Kontak" },
  ];

  return (
    <div className="p-4 md:p-8">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brown uppercase tracking-tight">Kelola Anggota</h1>
            <p className="font-sans text-sm md:text-base text-brown-light mt-1">Atur data anggota kelas</p>
          </div>
          <button onClick={openAdd} className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 uppercase tracking-tight hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 self-start">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </AnimateIn>
      <AnimateIn delay={100}>

      <AdminTable data={data} columns={columns} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </AnimateIn>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Anggota" : "Tambah Anggota"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Nama</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Link Repo GitHub</label>
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-brown-light shrink-0" />
              <input type="url" value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/username" className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
            </div>
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Link LinkedIn</label>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-brown-light shrink-0" />
              <input type="url" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
            </div>
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Kontak</label>
            <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
          </div>
          <button type="submit" disabled={saving} className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3 disabled:opacity-50">
            {saving ? "Menyimpan..." : editing ? "SIMPAN" : "TAMBAH"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="HAPUS ANGGOTA"
        message={
          deleteTarget && (
            <>
              Yakin ingin menghapus <b className="text-brown">{deleteTarget.name}</b>?
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