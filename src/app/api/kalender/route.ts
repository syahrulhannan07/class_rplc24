import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.calendarEvent.findMany({ orderBy: { eventDate: "asc" } });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await prisma.calendarEvent.create({
      data: {
        eventName: body.eventName,
        eventDate: new Date(body.eventDate),
        eventTime: body.eventTime || null,
        location: body.location || null,
        description: body.description || null,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
  }
}