"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import { ShapeStar, ShapeSquare, ShapeCross, ShapeCircle, ShapeDiamond } from "@/components/ui/Shapes";

type Album = { id: number; name: string; eventDate: string | null; createdAt: string; coverImageUrl: string | null; photos?: { id: number }[]; _count?: { photos: number } };

function formatAlbumDate(date: string | null, fallback: string): string {
  const d = date ? new Date(date) : new Date(fallback);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

export default function AlbumAcaraSection() {
  const [data, setData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/galeri")
      .then((r) => r.json())
      .then((j) => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const albums = data.slice(0, 3);

  return (
    <section className="bg-light-cream border-b-4 border-brown py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ShapeDiamond className="absolute top-10 left-[8%] animate-spin-slow" color="bg-kelas-yellow" size={26} />
        <ShapeStar className="absolute top-8 right-[5%] animate-float" color="bg-kelas-pink" size={24} />
        <ShapeSquare className="absolute bottom-12 left-[20%] animate-float" color="bg-[#8af5ff]" size={20} />
        <ShapeCross className="absolute bottom-16 right-[10%] animate-float" color="bg-kelas-purple" size={22} />
        <ShapeCircle className="absolute top-1/2 right-[2%] animate-float" color="bg-beige" size={12} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-10">
          <AnimateIn>
            <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-brown">ALBUM ACARA</h2>
          </AnimateIn>
          <AnimateIn delay={200}>
            <Link href="/galeri" className="brutal-btn bg-brown text-cream font-serif font-bold text-sm md:text-base px-4 md:px-6 py-2 md:py-3 inline-block">
              LIHAT SEMUA ALBUM
            </Link>
          </AnimateIn>
        </div>

        {loading ? (
          <LoadingNeo variant="card" message="Memuat album acara..." />
        ) : albums.length === 0 ? (
          <AnimateIn>
            <div className="brutal-box bg-white p-8 md:p-12 text-center">
              <Camera size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
              <p className="font-serif text-xl md:text-2xl text-brown">Belum ada album acara.</p>
              <p className="font-sans text-sm md:text-base text-brown-light mt-2">Album foto akan muncul di sini.</p>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {albums.map((album, i) => (
              <AnimateIn key={album.id} delay={i * 150}>
                <Link
                  href={`/galeri/${album.id}`}
                  className="block brutal-box bg-white group hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all duration-300"
                >
                  <div className="h-40 md:h-44 bg-beige border-b-4 border-brown flex items-center justify-center relative overflow-hidden">
                    {album.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={album.coverImageUrl} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Camera size={40} strokeWidth={1.5} className="text-brown/30" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="font-serif font-bold text-xs text-white bg-brown px-2 py-1">
                        {formatAlbumDate(album.eventDate, album.createdAt)}
                      </span>
                    </div>
                    <ShapeSquare className="absolute bottom-2 right-2" color="bg-kelas-yellow" size={16} />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-serif font-bold text-lg md:text-xl text-brown group-hover:text-kelas-purple transition-colors">
                      {album.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-brown/10">
                      <span className="brutal-tag bg-cream">{album._count?.photos ?? album.photos?.length ?? 0} foto</span>
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
  );
}
