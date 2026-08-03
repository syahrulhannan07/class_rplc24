import Link from "next/link";
import Image from "next/image";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { ShapeStar, ShapeDiamond, ShapeSquare } from "@/components/ui/Shapes";

export default function Footer() {
  return (
    <footer className="w-full bg-cream border-t-4 border-brown mt-auto relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ShapeStar className="absolute top-8 left-[10%]" color="bg-kelas-yellow" size={16} />
        <ShapeDiamond className="absolute bottom-12 right-[8%]" color="bg-kelas-pink" size={14} />
        <ShapeSquare className="absolute top-12 right-[20%]" color="bg-beige" size={12} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-brown rounded-full flex items-center justify-center overflow-hidden shadow-[2px_2px_0_0_#1f1c0b]">
                <Image
                  src="/logo-rpl2c.png"
                  alt="Logo RPL 2C"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display font-bold text-lg md:text-xl text-brown uppercase tracking-tight">
                RPL 3C
              </h3>
            </div>
            <p className="font-sans text-sm md:text-base text-brown-light leading-relaxed">
              So make the friendship bracelets, take the moment and taste it.
            </p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm md:text-base text-brown mb-4 uppercase tracking-wide border-b-2 border-brown pb-2 inline-block">
              NAVIGASI
            </h4>
            <ul className="space-y-2 mt-4">
              {[
                { href: "/jadwal", label: "Jadwal Kuliah" },
                { href: "/pengumuman", label: "Pengumuman" },
                { href: "/galeri", label: "Galeri Foto" },
                { href: "/anggota", label: "Anggota Kelas" },
                { href: "/kalender", label: "Kalender Acara" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm md:text-base text-brown hover:text-kelas-purple transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-kelas-yellow border border-brown group-hover:scale-150 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm md:text-base text-brown mb-4 uppercase tracking-wide border-b-2 border-brown pb-2 inline-block">
              KONTAK
            </h4>
            <ul className="space-y-2 mt-4">
              <li>
                <a
                  href="https://www.instagram.com/soft.eng_3c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm md:text-base text-brown-light hover:text-kelas-purple transition-colors flex items-center gap-2"
                >
                  <InstagramIcon size={16} className="text-brown shrink-0" />
                  @soft.eng_3c
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t-4 border-brown relative">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-serif font-bold text-xs md:text-sm text-brown uppercase tracking-wider">
            &copy; {new Date().getFullYear()} RPL 2C — ALL RIGHTS RESERVED
          </p>
          <p className="font-serif font-bold text-xs text-brown-light uppercase tracking-wider">
            NO SOFT GRADIENTS ALLOWED
          </p>
        </div>
      </div>
    </footer>
  );
}