import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.classOfficer.findMany({ orderBy: { displayOrder: "asc" } });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await prisma.classOfficer.create({
      data: {
        name: body.name,
        position: body.position,
        photoUrl: body.photoUrl || null,
        contact: body.contact || null,
        description: body.description || null,
        displayOrder: body.displayOrder ?? 0,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
  }
}