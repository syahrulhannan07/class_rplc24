"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, ImageIcon } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import { ShapeStar, ShapeDiamond, ShapeSquare } from "@/components/ui/Shapes";

type Album = { id: number; name: string; description: string | null; eventDate: string | null; coverImageUrl: string | null; _count?: { photos: number } };

export default function GaleriPage() {
  const [data, setData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/galeri")
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-10 left-[5%]" color="bg-kelas-yellow" size={26} />
          <ShapeDiamond className="absolute top-8 right-[8%]" color="bg-kelas-pink" size={24} />
          <ShapeSquare className="absolute bottom-8 left-[15%]" color="bg-beige" size={20} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16 relative">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-3">
              <ImageIcon size={24} className="text-kelas-purple" />
              <span className="brutal-tag bg-light-pink">{data.length} album</span>
            </div>
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-brown">GALERI FOTO</h1>
            <p className="font-sans text-base md:text-lg text-brown-light mt-1 md:mt-2">Dokumentasi momen dan kegiatan kelas RPL 3C</p>
          </AnimateIn>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {loading ? (
            <LoadingNeo variant="page" message="Memuat galeri foto..." />
          ) : data.length === 0 ? (
            <AnimateIn>
              <div className="brutal-box bg-white p-8 md:p-12 text-center">
                <Camera size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-xl md:text-2xl text-brown">Belum ada album.</p>
                <p className="font-sans text-sm md:text-base text-brown-light mt-2">Album foto akan muncul di sini.</p>
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {data.map((album, i) => (
                <AnimateIn key={album.id} delay={i * 80}>
                  <Link
                    href={`/galeri/${album.id}`}
                    className="block brutal-box bg-white hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all duration-300 group"
                  >
                    <div className="h-36 md:h-44 bg-beige border-b-4 border-brown flex items-center justify-center relative overflow-hidden">
                      {album.coverImageUrl ? (
                        <img src={album.coverImageUrl} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Camera size={40} strokeWidth={1.5} className="text-brown/30" />
                      )}
                      <div className="absolute top-2 right-2">
                        <ShapeStar color="bg-kelas-yellow" size={16} />
                      </div>
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-serif font-bold text-lg md:text-xl text-brown group-hover:text-kelas-purple transition-colors">
                        {album.name}
                      </h3>
                      {album.description && (
                        <p className="font-sans text-xs md:text-sm text-brown-light mt-1 line-clamp-1">{album.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-brown/10">
                        <span className="brutal-tag bg-cream">{album._count?.photos ?? 0} foto</span>
                        <span className="font-serif text-[10px] text-brown-light uppercase tracking-wider">Lihat &rarr;</span>
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