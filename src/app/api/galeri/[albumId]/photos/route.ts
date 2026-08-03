import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveFile, validateFile } from "@/lib/upload";

export async function POST(req: Request, { params }: { params: Promise<{ albumId: string }> }) {
  try {
    const { albumId } = await params;
    const album = await prisma.galleryAlbum.findUnique({ where: { id: Number(albumId) } });
    if (!album) return NextResponse.json({ success: false, message: "Album tidak ditemukan" }, { status: 404 });

    const formData = await req.formData();
    const photo = formData.get("photo") as File;
    const caption = formData.get("caption") as string | null;

    if (!photo || photo.size === 0) {
      return NextResponse.json({ success: false, message: "File foto diperlukan" }, { status: 400 });
    }

    const error = validateFile(photo);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });

    const photoUrl = await saveFile(photo, "gallery");
    const item = await prisma.galleryPhoto.create({
      data: {
        albumId: Number(albumId),
        photoUrl,
        caption: caption || null,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menambahkan foto" }, { status: 500 });
  }
}