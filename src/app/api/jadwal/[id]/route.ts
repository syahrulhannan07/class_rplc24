import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.classSchedule.update({
      where: { id: Number(id) },
      data: {
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        courseName: body.courseName,
        lecturer: body.lecturer,
        room: body.room,
        jenis: body.jenis ?? "TEORI",
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
    await prisma.classSchedule.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}