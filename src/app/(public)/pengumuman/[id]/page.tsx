import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Megaphone } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCross, ShapeCircle } from "@/components/ui/Shapes";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEventDate(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PengumumanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ann = await prisma.announcement.findUnique({ where: { id: Number(id) } });

  if (!ann) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-12 left-[10%]" color="bg-kelas-yellow" size={28} />
          <ShapeDiamond className="absolute bottom-16 right-[12%]" color="bg-kelas-pink" size={24} />
          <ShapeSquare className="absolute bottom-10 left-[15%]" color="bg-[#8af5ff]" size={18} />
        </div>
        <div className="brutal-box bg-white p-8 md:p-12 text-center max-w-md relative">
          <div className="w-16 h-16 brutal-box-sm bg-kelas-pink mx-auto flex items-center justify-center mb-4">
            <Megaphone size={30} className="text-brown" />
          </div>
          <h1 className="font-serif font-extrabold text-3xl text-brown mb-2">Pengumuman Tidak Ditemukan</h1>
          <p className="font-sans text-brown-light mb-6">Pengumuman yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <Link href="/pengumuman" className="brutal-btn bg-kelas-yellow text-brown font-display font-bold px-6 py-3 inline-block hover:-translate-y-1 transition-all">
            KEMBALI KE PENGUMUMAN
          </Link>
        </div>
      </div>
    );
  }

  const words = ann.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(words / 200));

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-8 left-[5%]" color="bg-kelas-yellow" size={24} />
          <ShapeDiamond className="absolute top-10 right-[8%]" color="bg-kelas-pink" size={20} />
          <ShapeSquare className="absolute bottom-8 left-[22%]" color="bg-[#8af5ff]" size={16} />
          <ShapeCross className="absolute bottom-10 right-[20%]" color="bg-beige" size={18} />
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-10 py-8 md:py-12 relative">
          <AnimateIn>
            <Link href="/pengumuman" className="font-serif font-bold text-sm md:text-base text-kelas-purple hover:text-kelas-pink transition-colors mb-4 md:mb-6 inline-flex items-center gap-1.5 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Pengumuman
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
              <span className="brutal-tag bg-kelas-yellow inline-flex items-center gap-1.5">
                <Megaphone size={12} className="shrink-0" /> PENGUMUMAN
              </span>
              <span className="brutal-tag bg-white inline-flex items-center gap-1.5">
                <Calendar size={12} className="shrink-0 text-kelas-purple" /> Dipublikasikan {formatDate(ann.publishedAt)}
              </span>
              <span className="brutal-tag bg-beige inline-flex items-center gap-1.5">
                <Clock size={12} className="shrink-0" /> {readTime} menit baca
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-3xl md:text-5xl text-brown leading-tight max-w-3xl">
              {ann.title}
            </h1>

            {(ann.eventDate || ann.eventTime || ann.location) && (
              <div className="brutal-box-sm bg-white mt-6 md:mt-8 relative overflow-hidden">
                <div className="bg-kelas-yellow border-b-2 border-brown px-4 py-2 inline-block">
                  <span className="font-display font-bold text-xs md:text-sm text-brown uppercase tracking-wider">
                    Informasi Pelaksanaan
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-brown/10">
                  {ann.eventDate && (
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-9 h-9 brutal-box-sm bg-kelas-pink shrink-0 flex items-center justify-center">
                        <Calendar size={16} className="text-brown" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-[10px] md:text-xs text-brown uppercase tracking-wider mb-0.5">Tanggal</p>
                        <p className="font-sans text-xs md:text-sm font-bold text-brown">{formatEventDate(ann.eventDate)}</p>
                        {ann.eventTime && (
                          <p className="font-sans text-xs md:text-sm text-brown-light mt-0.5">{ann.eventTime} WIB</p>
                        )}
                      </div>
                    </div>
                  )}
                  {ann.location && (
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-9 h-9 brutal-box-sm bg-[#8af5ff] shrink-0 flex items-center justify-center">
                        <MapPin size={16} className="text-brown" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-[10px] md:text-xs text-brown uppercase tracking-wider mb-0.5">Tempat</p>
                        <p className="font-sans text-xs md:text-sm font-bold text-brown">{ann.location}</p>
                      </div>
                    </div>
                  )}
                  {ann.eventDate && ann.location && (
                    <div className="flex items-start gap-3 p-4 bg-beige/40">
                      <div className="w-9 h-9 brutal-box-sm bg-kelas-yellow shrink-0 flex items-center justify-center">
                        <Clock size={16} className="text-brown" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-[10px] md:text-xs text-brown uppercase tracking-wider mb-0.5">Catatan</p>
                        <p className="font-sans text-xs md:text-sm text-brown-light">Hadir tepat waktu &amp; catat agenda ini di kalender kelas.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </AnimateIn>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <AnimateIn delay={100}>
            <div className="brutal-box bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-kelas-yellow border-b-2 border-brown" />
              <div className="absolute top-4 right-4 pointer-events-none">
                <ShapeStar color="bg-kelas-pink" size={16} />
              </div>
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <ShapeCircle color="bg-beige" size={12} />
              </div>
              <div className="p-6 md:p-10 md:pt-12">
                <div className="border-l-4 border-kelas-purple pl-4 md:pl-6">
                  <p className="font-sans text-sm md:text-base leading-loose text-brown-light whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 md:mt-10">
              <Link href="/pengumuman" className="brutal-btn bg-cream text-brown font-display font-bold text-sm px-5 py-3 inline-flex items-center justify-center gap-2 hover:-translate-y-1 transition-all">
                <ArrowLeft size={16} /> SEMUA PENGUMUMAN
              </Link>
              <Link href="/" className="brutal-btn bg-brown text-cream font-display font-bold text-sm px-5 py-3 inline-flex items-center justify-center gap-2 hover:-translate-y-1 transition-all">
                KE BERANDA <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}