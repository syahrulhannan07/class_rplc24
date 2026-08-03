import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile, saveFile, validateFile } from "@/lib/upload";

export async function GET(_req: Request, { params }: { params: Promise<{ albumId: string }> }) {
  try {
    const { albumId } = await params;
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: Number(albumId) },
      include: { photos: { orderBy: { createdAt: "asc" } } },
    });
    if (!album) return NextResponse.json({ success: false, message: "Album tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: album });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil album" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ albumId: string }> }) {
  try {
    const { albumId } = await params;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const eventDate = formData.get("eventDate") as string | null;
    const cover = formData.get("cover") as File | null;

    const existing = await prisma.galleryAlbum.findUnique({ where: { id: Number(albumId) } });
    if (!existing) return NextResponse.json({ success: false, message: "Album tidak ditemukan" }, { status: 404 });

    let coverImageUrl = existing.coverImageUrl;
    if (cover && cover.size > 0) {
      const error = validateFile(cover);
      if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });
      coverImageUrl = await saveFile(cover, "gallery");
      if (existing.coverImageUrl) await deleteFile(existing.coverImageUrl);
    }

    const item = await prisma.galleryAlbum.update({
      where: { id: Number(albumId) },
      data: {
        name,
        description: description || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        coverImageUrl,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengupdate album" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ albumId: string }> }) {
  try {
    const { albumId } = await params;
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: Number(albumId) },
      include: { photos: true },
    });
    if (!album) return NextResponse.json({ success: false, message: "Album tidak ditemukan" }, { status: 404 });

    for (const photo of album.photos) {
      await deleteFile(photo.photoUrl);
    }
    if (album.coverImageUrl) await deleteFile(album.coverImageUrl);

    await prisma.galleryAlbum.delete({ where: { id: Number(albumId) } });
    return NextResponse.json({ success: true, message: "Album berhasil dihapus" });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menghapus album" }, { status: 500 });
  }
}