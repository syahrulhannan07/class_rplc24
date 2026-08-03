import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.classSchedule.findMany({ orderBy: [{ day: "asc" }, { startTime: "asc" }] });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await prisma.classSchedule.create({
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
    return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
  }
}