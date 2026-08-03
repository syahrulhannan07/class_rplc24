import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.announcement.findMany({ orderBy: { publishedAt: "desc" } });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventTime: body.eventTime || null,
        location: body.location || null,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
  }
}