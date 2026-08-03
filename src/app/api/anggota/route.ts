import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.classMember.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await prisma.classMember.create({
      data: {
        name: body.name,
        githubUrl: body.githubUrl || null,
        linkedinUrl: body.linkedinUrl || null,
        photoUrl: body.photoUrl || null,
        contact: body.contact || null,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
  }
}