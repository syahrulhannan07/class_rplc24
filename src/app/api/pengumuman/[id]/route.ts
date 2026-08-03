import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.announcement.findUnique({ where: { id: Number(id) } });
    if (!item) return NextResponse.json({ success: false, message: "Pengumuman tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.announcement.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        content: body.content,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventTime: body.eventTime || null,
        location: body.location || null,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengupdate data" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.announcement.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}