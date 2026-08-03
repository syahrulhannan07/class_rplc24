import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import { ShapeStar, ShapeDiamond, ShapeSquare } from "@/components/ui/Shapes";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlbumDetailPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;

  const album = await prisma.galleryAlbum.findUnique({
    where: { id: Number(albumId) },
    include: { photos: { orderBy: { createdAt: "asc" } } },
  });

  if (!album) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-12 left-[10%]" color="bg-kelas-yellow" size={28} />
          <ShapeDiamond className="absolute bottom-16 right-[12%]" color="bg-kelas-pink" size={24} />
          <ShapeSquare className="absolute bottom-10 left-[15%]" color="bg-beige" size={18} />
        </div>
        <div className="brutal-box bg-white p-8 md:p-12 text-center max-w-md relative">
          <div className="w-16 h-16 brutal-box-sm bg-kelas-pink mx-auto flex items-center justify-center mb-4">
            <Camera size={30} className="text-brown" />
          </div>
          <h1 className="font-serif font-extrabold text-3xl text-brown mb-2">Album Tidak Ditemukan</h1>
          <p className="font-sans text-brown-light mb-6">Album yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <Link href="/galeri" className="brutal-btn bg-kelas-yellow text-brown font-display font-bold px-6 py-3 inline-block hover:-translate-y-1 transition-all">
            KEMBALI KE GALERI
          </Link>
        </div>
      </div>
    );
  }

  const photos = album.photos;

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-8 left-[5%]" color="bg-kelas-yellow" size={22} />
          <ShapeDiamond className="absolute top-12 right-[8%]" color="bg-kelas-pink" size={18} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 relative">
          <AnimateIn>
            <Link href="/galeri" className="font-serif font-bold text-sm md:text-base text-kelas-purple hover:text-kelas-pink transition-colors mb-3 inline-flex items-center gap-1 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Galeri
            </Link>
            <h1 className="font-serif font-extrabold text-3xl md:text-5xl text-brown">{album.name}</h1>
            {album.description && (
              <p className="font-sans text-sm md:text-base text-brown-light mt-2 max-w-2xl">{album.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className="brutal-tag bg-beige">{photos.length} foto</span>
              {album.eventDate && (
                <span className="font-sans text-xs text-brown-light">
                  {new Date(album.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
          </AnimateIn>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {photos.map((photo, i) => (
                <AnimateIn key={photo.id} delay={i * 50}>
                  <div className="brutal-box-sm bg-white overflow-hidden group hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1f1c0b] transition-all duration-200">
                    <div className="aspect-square overflow-hidden">
                      <img src={photo.photoUrl} alt={photo.caption ?? ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    {photo.caption && (
                      <p className="font-serif text-xs text-brown p-2 border-t-2 border-brown/10">{photo.caption}</p>
                    )}
                  </div>
                </AnimateIn>
              ))}
            </div>
          ) : (
            <AnimateIn>
              <div className="brutal-box bg-white p-12 text-center">
                <Camera size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-xl md:text-2xl text-brown">Belum ada foto di album ini.</p>
                <p className="font-sans text-sm text-brown-light mt-2">Foto-foto akan muncul di sini.</p>
              </div>
            </AnimateIn>
          )}
        </div>
      </section>
    </div>
  );
}
