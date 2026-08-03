"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import AnimateIn from "@/components/ui/AnimateIn";
import { toast } from "@/lib/toast";

const dayLabels: Record<string, string> = { SENIN: "Senin", SELASA: "Selasa", RABU: "Rabu", KAMIS: "Kamis", JUMAT: "Jumat", SABTU: "Sabtu", MINGGU: "Minggu" };

type Item = { id: number; day: string; startTime: string; endTime: string; courseName: string; lecturer: string; room: string; jenis: string };

const days = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

const jenisColors: Record<string, string> = {
  TEORI: "bg-kelas-yellow",
  PRAKTIKUM: "bg-beige",
};

export default function AdminJadwalPage() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ day: "SENIN", startTime: "", endTime: "", courseName: "", lecturer: "", room: "", jenis: "TEORI" });

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/jadwal");
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
        const res = await fetch("/api/jadwal");
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
    setForm({ day: "SENIN", startTime: "", endTime: "", courseName: "", lecturer: "", room: "", jenis: "TEORI" });
    setModal(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({ day: item.day, startTime: item.startTime, endTime: item.endTime, courseName: item.courseName, lecturer: item.lecturer, room: item.room, jenis: item.jenis ?? "TEORI" });
    setModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/jadwal/${editing.id}` : "/api/jadwal";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { setModal(false); fetchData(); toast.success(editing ? "Jadwal berhasil diperbarui" : "Jadwal berhasil ditambahkan"); }
    } catch {
      toast.error("Gagal menyimpan data jadwal");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/jadwal/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { fetchData(); toast.success("Jadwal berhasil dihapus"); setDeleteTarget(null); }
      else toast.error(json.message || "Gagal menghapus jadwal");
    } catch {
      toast.error("Gagal menghapus jadwal");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Item>[] = [
    { key: "day", label: "Hari", render: (item) => dayLabels[item.day] ?? item.day },
    { key: "startTime", label: "Mulai" },
    { key: "endTime", label: "Selesai" },
    { key: "courseName", label: "Mata Kuliah" },
    { key: "jenis", label: "Jenis", render: (item) => (
      <span className={`brutal-tag ${jenisColors[item.jenis] ?? "bg-cream"}`}>{item.jenis}</span>
    )},
    { key: "lecturer", label: "Dosen" },
    { key: "room", label: "Ruang" },
  ];

  return (
    <div className="p-4 md:p-8">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brown uppercase tracking-tight">Kelola Jadwal</h1>
            <p className="font-sans text-sm md:text-base text-brown-light mt-1">Atur jadwal pelajaran kelas</p>
          </div>
          <button onClick={openAdd} className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 uppercase tracking-tight hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 self-start">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </AnimateIn>
      <AnimateIn delay={100}>

      <AdminTable data={data} columns={columns} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </AnimateIn>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Jadwal" : "Tambah Jadwal"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Hari</label>
            <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow">
              {days.map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Jam Mulai</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
            </div>
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Jam Selesai</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
            </div>
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Mata Kuliah</label>
            <input value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Dosen</label>
            <input value={form.lecturer} onChange={e => setForm({ ...form, lecturer: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Ruang</label>
              <input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
            </div>
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Jenis</label>
              <select value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow">
                <option value="TEORI">Teori</option>
                <option value="PRAKTIKUM">Praktikum</option>
              </select>
            </div>
          <button type="submit" disabled={saving} className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3 disabled:opacity-50">
            {saving ? "Menyimpan..." : editing ? "SIMPAN" : "TAMBAH"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="HAPUS JADWAL"
        message={
          deleteTarget && (
            <>
              Yakin ingin menghapus jadwal <b className="text-brown">{deleteTarget.courseName}</b>?
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