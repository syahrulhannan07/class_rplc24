"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, Calendar, MapPin } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCross } from "@/components/ui/Shapes";

type Ann = { id: number; title: string; content: string; publishedAt: string; eventDate: string | null; eventTime: string | null; location: string | null };

const ACCENTS = ["bg-kelas-yellow", "bg-kelas-pink", "bg-[#8af5ff]", "bg-beige"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PengumumanPage() {
  const [data, setData] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pengumuman")
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-6 left-[8%]" color="bg-kelas-yellow" size={28} />
          <ShapeDiamond className="absolute top-10 right-[6%]" color="bg-kelas-pink" size={22} />
          <ShapeSquare className="absolute bottom-6 right-[22%]" color="bg-[#8af5ff]" size={18} />
          <ShapeCross className="absolute bottom-8 left-[18%]" color="bg-beige" size={20} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16 relative">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-3">
              <Megaphone size={24} className="text-kelas-purple" />
              <span className="brutal-tag bg-kelas-yellow">{data.length} pengumuman</span>
            </div>
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-brown">PENGUMUMAN</h1>
            <p className="font-sans text-base md:text-lg text-brown-light mt-1 md:mt-2">Informasi terbaru seputar kelas RPL 3C</p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {loading ? (
            <LoadingNeo variant="page" message="Memuat pengumuman..." />
          ) : data.length === 0 ? (
            <AnimateIn>
              <div className="brutal-box bg-white p-8 md:p-12 text-center">
                <Megaphone size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-xl md:text-2xl text-brown">Belum ada pengumuman.</p>
                <p className="font-sans text-sm md:text-base text-brown-light mt-2">Pengumuman akan muncul di sini.</p>
              </div>
            </AnimateIn>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {data.map((ann, i) => (
                <AnimateIn key={ann.id} delay={i * 80}>
                  <Link
                    href={`/pengumuman/${ann.id}`}
                    className="block brutal-box bg-white hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className={`h-2.5 w-full ${ACCENTS[i % ACCENTS.length]} border-b-2 border-brown`} />
                    <div className="p-4 md:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 md:mb-3">
                        <span className="brutal-tag bg-kelas-yellow inline-flex items-center gap-1.5">
                          <Megaphone size={12} className="shrink-0" /> PENGUMUMAN
                        </span>
                        <span className="font-sans text-xs md:text-sm font-bold text-brown-light">
                          {formatDate(ann.publishedAt)}
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-xl md:text-2xl text-brown leading-snug group-hover:text-kelas-purple transition-colors">
                        {ann.title}
                      </h2>
                      <p className="font-sans text-sm md:text-base text-brown-light mt-2 md:mt-3 line-clamp-2 border-l-3 border-beige pl-3">
                        {ann.content}
                      </p>
                      {(ann.eventDate || ann.location) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t-2 border-brown/10">
                          {ann.eventDate && (
                            <span className="font-sans text-xs md:text-sm font-bold text-brown inline-flex items-center gap-1.5">
                              <Calendar size={14} className="text-kelas-purple shrink-0" />
                              {formatEventDate(ann.eventDate)}
                              {ann.eventTime ? ` • ${ann.eventTime}` : ""}
                            </span>
                          )}
                          {ann.location && (
                            <span className="font-sans text-xs md:text-sm font-bold text-brown inline-flex items-center gap-1.5">
                              <MapPin size={14} className="text-kelas-pink shrink-0" />
                              {ann.location}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4 md:mt-5 pt-3 md:pt-4 border-t-2 border-brown/15">
                        <span className="font-display font-bold text-xs md:text-sm text-brown uppercase tracking-wider">
                          Baca Selengkapnya
                        </span>
                        <span className="brutal-box-sm bg-kelas-yellow w-8 h-8 md:w-9 md:h-9 flex items-center justify-center group-hover:bg-kelas-pink group-hover:translate-x-0.5 transition-all duration-200">
                          <ArrowRight size={16} className="text-brown" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}