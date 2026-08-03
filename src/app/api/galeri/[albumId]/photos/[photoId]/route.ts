import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/upload";

export async function DELETE(_req: Request, { params }: { params: Promise<{ albumId: string; photoId: string }> }) {
  try {
    const { albumId, photoId } = await params;
    const photo = await prisma.galleryPhoto.findUnique({ where: { id: Number(photoId) } });
    if (!photo) return NextResponse.json({ success: false, message: "Foto tidak ditemukan" }, { status: 404 });

    await deleteFile(photo.photoUrl);
    await prisma.galleryPhoto.delete({ where: { id: Number(photoId) } });
    return NextResponse.json({ success: true, message: "Foto berhasil dihapus" });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menghapus foto" }, { status: 500 });
  }
}