import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveFile, validateFile } from "@/lib/upload";

export async function GET() {
  try {
    const data = await prisma.galleryAlbum.findMany({
      include: {
        photos: { select: { id: true, photoUrl: true, caption: true }, orderBy: { createdAt: "asc" } },
        _count: { select: { photos: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const eventDate = formData.get("eventDate") as string | null;
    const cover = formData.get("cover") as File | null;

    let coverImageUrl: string | null = null;
    if (cover && cover.size > 0) {
      const error = validateFile(cover);
      if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });
      coverImageUrl = await saveFile(cover, "gallery");
    }

    const item = await prisma.galleryAlbum.create({
      data: {
        name,
        description: description || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        coverImageUrl,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menyimpan album" }, { status: 500 });
  }
}