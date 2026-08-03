import Link from "next/link";
import { cookies } from "next/headers";
import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCross, ShapeCircle, ShapeTriangle } from "@/components/ui/Shapes";

export default async function NotFoundPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ShapeStar className="absolute top-12 left-[8%]" color="bg-kelas-yellow" size={36} />
        <ShapeDiamond className="absolute top-20 right-[10%]" color="bg-kelas-pink" size={32} />
        <ShapeSquare className="absolute bottom-24 left-[12%]" color="bg-beige" size={28} />
        <ShapeCross className="absolute bottom-20 right-[15%]" color="bg-light-pink" size={26} />
        <ShapeCircle className="absolute top-1/3 left-[4%]" color="bg-kelas-yellow" size={20} />
        <ShapeTriangle className="absolute top-1/2 right-[5%]" color="" size={30} direction="up" />
        <ShapeDiamond className="absolute bottom-1/3 left-[20%]" color="bg-[#8af5ff]" size={24} />
        <ShapeStar className="absolute bottom-1/2 right-[8%]" color="bg-kelas-purple" size={22} />
      </div>

      <div className="brutal-box bg-white p-8 md:p-12 max-w-lg w-full mx-4 text-center relative z-10 animate-scale-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShapeSquare color="bg-kelas-yellow" size={24} />
          <ShapeStar color="bg-kelas-pink" size={28} />
          <ShapeSquare color="bg-[#8af5ff]" size={24} />
        </div>

        <div className="bg-kelas-yellow border-4 border-brown brutal-box-sm inline-block px-6 py-3 mb-6">
          <h1 className="font-serif font-extrabold text-7xl md:text-9xl text-brown leading-none">404</h1>
        </div>

        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brown uppercase tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h2>

        <p className="font-sans text-sm md:text-base text-brown-light mb-6 max-w-sm mx-auto">
          {isAdmin
            ? "Halaman admin yang Anda cari tidak tersedia."
            : "Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada."}
        </p>

        <Link
          href={isAdmin ? "/admin/dashboard" : "/"}
          className="brutal-btn bg-brown text-cream font-display font-bold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 inline-block hover:-translate-y-0.5 transition-all duration-200"
        >
          {isAdmin ? "KEMBALI KE DASHBOARD" : "KEMBALI KE BERANDA"}
        </Link>

        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2 h-2 bg-kelas-pink border border-brown" />
          <div className="w-2 h-2 bg-kelas-yellow border border-brown" />
          <div className="w-2 h-2 bg-beige border border-brown" />
          <div className="w-2 h-2 bg-[#8af5ff] border border-brown" />
          <div className="w-2 h-2 bg-kelas-purple border border-brown" />
        </div>
      </div>
    </div>
  );
}