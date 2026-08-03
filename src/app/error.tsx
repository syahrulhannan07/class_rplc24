"use client";

import { useEffect } from "react";
import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCross } from "@/components/ui/Shapes";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ShapeCross className="absolute top-16 left-[10%]" color="bg-kelas-pink" size={32} />
        <ShapeStar className="absolute top-24 right-[8%]" color="bg-kelas-yellow" size={28} />
        <ShapeSquare className="absolute bottom-20 left-[15%]" color="bg-beige" size={24} />
        <ShapeDiamond className="absolute bottom-24 right-[12%]" color="bg-[#8af5ff]" size={26} />
      </div>

      <div className="brutal-box bg-white p-8 md:p-12 max-w-lg w-full mx-4 text-center relative z-10 animate-scale-in">
        <div className="bg-kelas-pink border-4 border-brown brutal-box-sm inline-block px-4 py-2 mb-6">
          <span className="font-serif font-extrabold text-4xl md:text-5xl text-brown">!</span>
        </div>

        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brown uppercase tracking-tight mb-3">
          Terjadi Kesalahan
        </h2>

        <p className="font-sans text-sm md:text-base text-brown-light mb-6 max-w-sm mx-auto">
          Gagal memuat data. Silakan coba lagi.
        </p>

        <button
          onClick={reset}
          className="brutal-btn bg-brown text-cream font-display font-bold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 inline-block hover:-translate-y-0.5 transition-all duration-200"
        >
          COBA LAGI
        </button>
      </div>
    </div>
  );
}