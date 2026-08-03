"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import AnimateIn from "@/components/ui/AnimateIn";
import { toast } from "@/lib/toast";

type Album = { id: number; name: string; description: string | null; eventDate: string | null; coverImageUrl: string | null; photos: { id: number; photoUrl: string; caption: string | null }[] };

type DeleteTarget =
  | { kind: "album"; album: Album }
  | { kind: "photo"; albumId: number; photoId: number };

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

function validateUpload(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.";
  if (file.size > MAX_SIZE) return "Ukuran file maksimal 2MB.";
  return null;
}

export default function AdminGaleriPage() {
  const [data, setData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", eventDate: "" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [photoModal, setPhotoModal] = useState(false);
  const [photoAlbum, setPhotoAlbum] = useState<Album | null>(null);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/galeri");
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
        const res = await fetch("/api/galeri");
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
    setForm({ name: "", description: "", eventDate: "" });
    setCoverFile(null);
    setCoverPreview(null);
    setModal(true);
  }

  function openEdit(item: Album) {
    setEditing(item);
    setForm({ name: item.name, description: item.description ?? "", eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "" });
    setCoverFile(null);
    setCoverPreview(item.coverImageUrl);
    setModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      if (form.description) fd.set("description", form.description);
      if (form.eventDate) fd.set("eventDate", form.eventDate);
      if (coverFile) fd.set("cover", coverFile);

      const url = editing ? `/api/galeri/${editing.id}` : "/api/galeri";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (json.success) { setModal(false); fetchData(); toast.success(editing ? "Album berhasil diperbarui" : "Album berhasil ditambahkan"); }
      else toast.error(json.message || "Gagal menyimpan album");
    } catch {
      toast.error("Gagal menyimpan data album");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const url =
        deleteTarget.kind === "album"
          ? `/api/galeri/${deleteTarget.album.id}`
          : `/api/galeri/${deleteTarget.albumId}/photos/${deleteTarget.photoId}`;
      const res = await fetch(url, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchData();
        toast.success(deleteTarget.kind === "album" ? "Album berhasil dihapus" : "Foto berhasil dihapus");
        setDeleteTarget(null);
      } else toast.error(json.message || "Gagal menghapus data");
    } catch {
      toast.error("Gagal menghapus data");
    } finally {
      setDeleting(false);
    }
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateUpload(file);
    if (err) { toast.error(err); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function openPhotoModal(album: Album) {
    setPhotoAlbum(album);
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setPhotoModal(true);
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid: File[] = [];
    const previews: string[] = [];
    for (const f of files) {
      const err = validateUpload(f);
      if (err) { toast.error(`${f.name}: ${err}`); continue; }
      valid.push(f);
      previews.push(URL.createObjectURL(f));
    }
    setPhotoFiles(prev => [...prev, ...valid]);
    setPhotoPreviews(prev => [...prev, ...previews]);
  }

  function removePhotoPreview(index: number) {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function handleAddPhotos(e: FormEvent) {
    e.preventDefault();
    if (!photoAlbum || photoFiles.length === 0) return;
    setPhotoSaving(true);
    try {
      let successCount = 0;
      for (const file of photoFiles) {
        const fd = new FormData();
        fd.set("photo", file);
        const res = await fetch(`/api/galeri/${photoAlbum.id}/photos`, { method: "POST", body: fd });
        const json = await res.json();
        if (json.success) successCount++;
      }
      setPhotoModal(false);
      fetchData();
      toast.success(`${successCount} foto berhasil ditambahkan`);
      if (successCount < photoFiles.length) toast.error(`${photoFiles.length - successCount} foto gagal`);
    } catch {
      toast.error("Gagal menambahkan foto");
    } finally {
      setPhotoSaving(false);
    }
  }

  async function handleDeletePhoto(albumId: number, photoId: number) {
    setDeleteTarget({ kind: "photo", albumId, photoId });
  }

  const columns: Column<Album>[] = [
    { key: "name", label: "Album" },
    { key: "description", label: "Deskripsi", render: (item) => item.description ? (item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description) : "-" },
    {
      key: "photos",
      label: "Foto",
      render: (item) => (
        <div className="flex items-center gap-3">
          <span className="brutal-tag bg-cream">{item.photos?.length ?? 0} foto</span>
          <button onClick={() => openPhotoModal(item)} className="brutal-box-sm bg-kelas-purple text-cream px-3 py-1.5 font-display font-bold text-[11px] flex items-center gap-1 hover:scale-105 hover:bg-kelas-pink transition-all" title="Kelola foto album">
            <Plus size={12} /> Kelola Foto
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brown uppercase tracking-tight">Kelola Galeri</h1>
            <p className="font-sans text-sm md:text-base text-brown-light mt-1">Form &ldquo;Tambah Album&rdquo; untuk sampul kontainer, tombol &ldquo;Kelola Foto&rdquo; untuk isi foto album</p>
          </div>
          <button onClick={openAdd} className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 uppercase tracking-tight hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 self-start">
            <Plus size={16} /> Tambah Album
          </button>
        </div>
      </AnimateIn>
      <AnimateIn delay={100}>
        <AdminTable data={data} columns={columns} onEdit={openEdit} onDelete={(album) => setDeleteTarget({ kind: "album", album })} loading={loading} />
      </AnimateIn>

      {data.filter(a => (a.photos?.length ?? 0) > 0).length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-brown uppercase tracking-tight">Isi Foto Album</h2>
          <p className="font-sans text-xs md:text-sm text-brown-light -mt-3">Foto-foto di bawah tampil di halaman detail album saat pengunjung mengklik kontainer di halaman Galeri.</p>
          {data.filter(a => (a.photos?.length ?? 0) > 0).map(album => (
            <div key={album.id} className="brutal-box bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-bold text-brown">{album.name}</span>
                <button onClick={() => openPhotoModal(album)} className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-xs px-3 py-1 flex items-center gap-1">
                  <Plus size={14} /> Tambah Foto
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {album.photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img src={photo.photoUrl} alt={photo.caption ?? ""} className="w-24 h-24 object-cover border-2 border-brown" />
                    <button onClick={() => handleDeletePhoto(album.id, photo.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-kelas-pink border-2 border-brown flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Album" : "Tambah Album"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Nama Album</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" required />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow resize-none h-24" />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Tanggal Acara (opsional)</label>
            <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} className="w-full border-2 border-brown p-3 font-sans text-sm bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow" />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1">Foto Sampul (opsional)</label>
            <input type="file" ref={coverRef} accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
            <button type="button" onClick={() => coverRef.current?.click()} className="brutal-btn bg-cream text-brown font-display font-bold text-xs px-4 py-2 flex items-center gap-2">
              <Upload size={14} /> {coverFile ? "Ganti Sampul" : "Pilih Sampul"}
            </button>
            {coverPreview && (
              <div className="mt-2 relative inline-block">
                <img src={coverPreview} alt="Preview" className="h-24 w-24 object-cover border-2 border-brown" />
                <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(editing?.coverImageUrl ?? null); }} className="absolute -top-2 -right-2 w-5 h-5 bg-kelas-pink border-2 border-brown flex items-center justify-center text-[10px]">X</button>
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3 disabled:opacity-50">
            {saving ? "Menyimpan..." : editing ? "SIMPAN" : "TAMBAH"}
          </button>
        </form>
      </Modal>

      {photoAlbum && (
        <Modal open={photoModal} onClose={() => setPhotoModal(false)} title={`Tambah Foto ke "${photoAlbum.name}"`}>
          <form onSubmit={handleAddPhotos} className="space-y-4">
            <div>
              <label className="font-serif font-bold text-sm text-brown block mb-1">Pilih Foto (bisa multiple)</label>
              <input type="file" ref={photoRef} accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoSelect} className="hidden" />
              <button type="button" onClick={() => photoRef.current?.click()} className="brutal-btn bg-cream text-brown font-display font-bold text-xs px-4 py-2 flex items-center gap-2 w-full justify-center">
                <Upload size={14} /> Pilih Foto
              </button>
            </div>
            {photoPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photoPreviews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <img src={preview} alt="" className="w-16 h-16 object-cover border-2 border-brown" />
                    <button type="button" onClick={() => removePhotoPreview(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-kelas-pink border-2 border-brown flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                  </div>
                ))}
              </div>
            )}
            <button type="submit" disabled={photoSaving || photoFiles.length === 0} className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3 disabled:opacity-50">
              {photoSaving ? "Menyimpan..." : `TAMBAH ${photoFiles.length} FOTO`}
            </button>
          </form>
        </Modal>
      )}
      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "album" ? "HAPUS ALBUM" : "HAPUS FOTO"}
        message={
          deleteTarget &&
          (deleteTarget.kind === "album" ? (
            <>
              Yakin ingin menghapus album <b className="text-brown">{deleteTarget.album.name}</b>?
              <br /> Semua foto di dalam album ini juga akan terhapus. Tindakan ini tidak bisa dibatalkan.
            </>
          ) : (
            <>
              Yakin ingin menghapus foto ini?
              <br /> Tindakan ini tidak bisa dibatalkan.
            </>
          ))
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}