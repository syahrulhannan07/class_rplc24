"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal", label: "Jadwal" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/galeri", label: "Galeri" },
  { href: "/anggota", label: "Anggota" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <header className="w-full bg-cream sticky top-0 z-50 pt-2 md:pt-4 pb-1">
      <div className="max-w-7xl mx-auto px-3 md:px-10">
        <div className="bg-white border-4 border-brown rounded-full shadow-[6px_6px_0_0_#1f1c0b] flex items-center justify-between h-14 md:h-16 px-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white border-3 md:border-4 border-brown rounded-full shadow-[2px_2px_0_0_#1f1c0b] md:shadow-[3px_3px_0_0_#1f1c0b] flex items-center justify-center overflow-hidden group-hover:rotate-12 transition-transform duration-300">
              <Image
                src="/logo-rpl2c.png"
                alt="Logo RPL 2C"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-sm md:text-xl text-brown uppercase tracking-tight group-hover:text-kelas-purple transition-colors">
              RPL 3C
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display font-semibold text-sm px-5 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-kelas-yellow text-brown border-2 border-brown shadow-[3px_3px_0_0_#1f1c0b]"
                      : "text-brown-light hover:text-brown hover:bg-beige/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 border-2 border-brown rounded-full shadow-[2px_2px_0_0_#1f1c0b] bg-white flex items-center justify-center hover:bg-kelas-yellow transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div
            className="md:hidden mt-2 bg-white border-4 border-brown rounded-2xl shadow-[4px_4px_0_0_#1f1c0b] px-3 py-4"
            style={{
              animation: "fade-in-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            }}
          >
            <div className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block font-display font-semibold text-center px-5 py-3 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-kelas-yellow text-brown border-2 border-brown shadow-[3px_3px_0_0_#1f1c0b]"
                        : "text-brown border-2 border-brown/10 hover:bg-beige/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}