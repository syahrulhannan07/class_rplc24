"use client";

import { useState, useEffect } from "react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { ShapeStar, ShapeSquare, ShapeCross, ShapeCircle, ShapeTriangle } from "@/components/ui/Shapes";

type Officer = { id: number; name: string; position: string; photoUrl: string | null; contact: string | null };

const CARD_COLORS = ["bg-kelas-pink", "bg-kelas-yellow", "bg-[#8af5ff]", "bg-beige"];

export default function PengurusSection() {
  const [data, setData] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pengurus")
      .then((r) => r.json())
      .then((j) => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-cream border-b-4 border-brown py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ShapeStar className="absolute top-12 left-[4%] animate-float" color="bg-kelas-yellow" size={28} />
        <ShapeSquare className="absolute top-24 right-[8%] animate-spin-slow" color="bg-kelas-pink" size={20} />
        <ShapeCross className="absolute bottom-16 left-[12%] animate-float" color="bg-[#8af5ff]" size={22} />
        <ShapeCircle className="absolute bottom-20 right-[5%] animate-float" color="bg-beige" size={16} />
        <ShapeTriangle className="absolute top-1/3 right-[3%] animate-float" color="" size={20} direction="right" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
        <AnimateIn>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-brown mb-8 md:mb-12">
            STRUKTUR PENGURUS
          </h2>
        </AnimateIn>

        {loading ? (
          <div className="max-w-xl mx-auto">
            <LoadingNeo variant="card" message="Memuat data pengurus..." />
          </div>
        ) : data.length === 0 ? (
          <AnimateIn>
            <div className="brutal-box bg-white p-8 md:p-12 text-center max-w-xl mx-auto">
              <p className="font-serif text-xl md:text-2xl text-brown">Belum ada data pengurus.</p>
              <p className="font-sans text-sm md:text-base text-brown-light mt-2">Data akan segera diisi.</p>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.map((officer, i) => (
              <AnimateIn key={officer.id} delay={(i % 4) * 150}>
                <div className={`${CARD_COLORS[i % CARD_COLORS.length]} border-4 border-brown brutal-box p-4 md:p-6 relative overflow-hidden`}>
                  <ShapeStar className="absolute top-2 right-2" color="bg-white" size={14} />
                  <div className="w-[80px] h-[80px] md:w-[130px] md:h-[130px] bg-white border-4 border-brown rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
                    {officer.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={officer.photoUrl} alt={officer.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif font-bold text-2xl md:text-3xl text-brown">
                        {officer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-sm md:text-xl text-brown">{officer.name}</h3>
                  <p className="font-serif font-bold text-xs md:text-sm text-brown mt-1">{officer.position}</p>
                  {officer.contact && (
                    <p className="flex items-center justify-center gap-1.5 mt-2">
                      <InstagramIcon size={14} className="text-brown shrink-0" />
                      <span className="font-sans text-xs md:text-sm text-brown-light truncate">{officer.contact}</span>
                    </p>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}