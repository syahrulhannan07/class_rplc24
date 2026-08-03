"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { ShapeStar, ShapeDiamond, ShapeSquare } from "@/components/ui/Shapes";

type Officer = { id: number; name: string; position: string; photoUrl: string | null; contact: string | null };

export default function PengurusPage() {
  const [data, setData] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pengurus")
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-8 left-[5%]" color="bg-kelas-yellow" size={24} />
          <ShapeDiamond className="absolute top-12 right-[10%]" color="bg-kelas-pink" size={20} />
          <ShapeSquare className="absolute bottom-8 left-[15%]" color="bg-beige" size={18} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16 relative">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-3">
              <Users size={24} className="text-kelas-purple" />
              <span className="brutal-tag bg-kelas-pink">{data.length} pengurus</span>
            </div>
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-brown">STRUKTUR PENGURUS</h1>
            <p className="font-sans text-base md:text-lg text-brown-light mt-1 md:mt-2">Kenali pengurus kelas RPL 3C</p>
          </AnimateIn>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {loading ? (
            <LoadingNeo variant="page" message="Memuat data pengurus..." />
          ) : data.length === 0 ? (
            <AnimateIn>
              <div className="brutal-box bg-white p-8 md:p-12 text-center">
                <Users size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-xl md:text-2xl text-brown">Belum ada data pengurus.</p>
                <p className="font-sans text-sm md:text-base text-brown-light mt-2">Data akan segera diisi.</p>
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {data.map((officer, i) => {
                const isExpanded = expandedId === officer.id;
                return (
                  <AnimateIn key={officer.id} delay={i * 80}>
                    <div
                      className="brutal-box bg-white p-4 md:p-6 text-center hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                      onClick={() => setExpandedId(isExpanded ? null : officer.id)}
                    >
                      <ShapeStar className="absolute top-2 right-2" color="bg-kelas-yellow" size={12} />
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-kelas-yellow border-4 border-brown rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center group-hover:bg-kelas-pink transition-colors duration-300">
                        <span className="font-serif font-bold text-2xl md:text-3xl text-brown">{officer.name.charAt(0)}</span>
                      </div>
                      <h3 className="font-serif font-bold text-lg md:text-xl text-brown group-hover:text-kelas-purple transition-colors">{officer.name}</h3>
                      <p className="font-serif font-bold text-sm text-kelas-purple mt-1">{officer.position}</p>
                      {officer.contact && (
                        <div className={`mt-3 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-20" : "max-h-0"}`}>
                          <div className="flex items-center justify-center gap-2 pt-2 border-t-2 border-brown/20">
                            <InstagramIcon size={14} className="text-brown-light shrink-0" />
                            <span className="font-sans text-xs md:text-sm text-brown-light">{officer.contact}</span>
                          </div>
                        </div>
                      )}
                      <p className="font-serif font-bold text-[10px] text-brown-light mt-2 uppercase tracking-wider">
                        {isExpanded ? "TUTUP" : "KONTAK"} &darr;
                      </p>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}