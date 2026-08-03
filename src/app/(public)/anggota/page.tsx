"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, UserCheck, X, Camera, Hash, GitBranch, Briefcase, Link2 } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import {
  ShapeStar,
  ShapeDiamond,
  ShapeSquare,
  ShapeCircle,
  ShapeTriangle,
} from "@/components/ui/Shapes";

type Member = {
  id: number;
  name: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  photoUrl: string | null;
  contact: string | null;
};

const ACCENT_COLORS = [
  { bg: "bg-kelas-yellow", border: "border-kelas-yellow", text: "text-kelas-yellow", light: "bg-kelas-yellow/10" },
  { bg: "bg-kelas-pink", border: "border-kelas-pink", text: "text-kelas-pink", light: "bg-kelas-pink/10" },
  { bg: "bg-kelas-purple", border: "border-kelas-purple", text: "text-kelas-purple", light: "bg-kelas-purple/10" },
  { bg: "bg-[#8af5ff]", border: "border-[#8af5ff]", text: "text-[#8af5ff]", light: "bg-[#8af5ff]/10" },
  { bg: "bg-orange", border: "border-orange", text: "text-orange", light: "bg-orange/10" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getUniqueAlphabet(data: Member[]) {
  const letters = new Set<string>();
  data.forEach((m) => {
    const first = m.name.charAt(0).toUpperCase();
    if (first >= "A" && first <= "Z") letters.add(first);
  });
  return Array.from(letters).sort();
}

export default function AnggotaPage() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/anggota")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setData(j.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.githubUrl ?? "").toLowerCase().includes(q) ||
          (m.linkedinUrl ?? "").toLowerCase().includes(q) ||
          (m.contact ?? "").toLowerCase().includes(q)
      );
    }
    if (activeLetter) {
      result = result.filter((m) =>
        m.name.toUpperCase().startsWith(activeLetter)
      );
    }
    return result;
  }, [data, search, activeLetter]);

  const alphabet = useMemo(() => getUniqueAlphabet(data), [data]);

  const stats = useMemo(() => {
    const withLinks = data.filter((m) => m.githubUrl || m.linkedinUrl);
    const withContact = data.filter((m) => m.contact);
    return {
      total: data.length,
      withLinks: withLinks.length,
      withContact: withContact.length,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-cream">
      {/* ─── HERO ─── */}
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-8 left-[5%]" color="bg-kelas-yellow" size={28} />
          <ShapeDiamond className="absolute top-16 right-[12%]" color="bg-kelas-pink" size={32} />
          <ShapeTriangle className="absolute bottom-12 left-[10%]" color="" size={28} direction="up" />
          <ShapeSquare className="absolute bottom-10 right-[6%]" color="bg-[#8af5ff]" size={22} />
          <ShapeCircle className="absolute top-1/3 right-[20%]" color="bg-orange" size={18} />
          <ShapeStar className="absolute bottom-1/4 left-[3%]" color="bg-beige" size={16} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16 relative">
          <AnimateIn>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <UserCheck size={28} className="text-kelas-purple" />
                  <span className="brutal-tag bg-beige">{stats.total} anggota</span>
                </div>
                <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-brown leading-tight">
                  ANGGOTA KELAS
                </h1>
                <p className="font-sans text-base md:text-lg text-brown-light mt-2 max-w-xl">
                  Kenali teman-teman sekelas RPL 3C — satu keluarga, satu tujuan.
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="brutal-box-sm bg-white px-4 py-2 text-center min-w-[90px]">
                  <p className="font-display font-extrabold text-2xl text-brown">{stats.total}</p>
                  <p className="font-sans text-[10px] text-brown-light uppercase tracking-wider">Total</p>
                </div>
                <div className="brutal-box-sm bg-white px-4 py-2 text-center min-w-[90px]">
                  <p className="font-display font-extrabold text-2xl text-brown">{stats.withLinks}</p>
                  <p className="font-sans text-[10px] text-brown-light uppercase tracking-wider">Portofolio</p>
                </div>
                <div className="brutal-box-sm bg-white px-4 py-2 text-center min-w-[90px]">
                  <p className="font-display font-extrabold text-2xl text-brown">{stats.withContact}</p>
                  <p className="font-sans text-[10px] text-brown-light uppercase tracking-wider">Kontak</p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      <section className="border-b-4 border-brown bg-white/50">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 md:py-5">
          <AnimateIn>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <div className="brutal-box-sm bg-white flex items-center gap-2 p-2 md:p-3 max-w-md flex-1">
                <Search size={18} className="text-brown-light shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveLetter(null);
                  }}
                  placeholder="Cari nama, kontak, atau link..."
                  className="w-full bg-transparent font-serif text-sm md:text-base text-brown placeholder:text-brown-light/60 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-brown-light hover:text-brown transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {alphabet.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-sans text-[10px] text-brown-light uppercase tracking-wider mr-1">
                    <Hash size={14} className="inline" />
                  </span>
                  <button
                    onClick={() => setActiveLetter(null)}
                    className={`w-7 h-7 brutal-box-sm flex items-center justify-center font-serif font-bold text-xs transition-all duration-200 ${
                      activeLetter === null
                        ? "bg-brown text-cream"
                        : "bg-white text-brown hover:bg-kelas-yellow"
                    }`}
                  >
                    All
                  </button>
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => {
                        setActiveLetter(letter);
                        setSearch("");
                      }}
                      className={`w-7 h-7 brutal-box-sm flex items-center justify-center font-serif font-bold text-xs transition-all duration-200 ${
                        activeLetter === letter
                          ? "bg-brown text-cream"
                          : "bg-white text-brown hover:bg-kelas-yellow"
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── MEMBER GRID ─── */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {loading ? (
            <LoadingNeo variant="page" message="Memuat data anggota..." />
          ) : filtered.length === 0 ? (
            <AnimateIn>
              <div className="brutal-box bg-white p-8 md:p-14 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <ShapeStar className="absolute top-6 left-[10%]" color="bg-kelas-yellow" size={20} />
                  <ShapeDiamond className="absolute bottom-6 right-[8%]" color="bg-kelas-pink" size={18} />
                  <ShapeSquare className="absolute top-1/2 left-[4%]" color="bg-beige" size={14} />
                </div>
                <Search size={52} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-2xl md:text-3xl text-brown">
                  {search || activeLetter
                    ? "Pencarian tidak ditemukan."
                    : "Belum ada anggota."}
                </p>
                <p className="font-sans text-sm md:text-base text-brown-light mt-2">
                  {search || activeLetter
                    ? "Coba kata kunci atau huruf lain."
                    : "Data anggota akan muncul di sini."}
                </p>
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((member, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                const hasLink = !!(member.githubUrl || member.linkedinUrl);
                return (
                  <AnimateIn key={member.id} delay={i * 60}>
                    <div className="brutal-box bg-white relative overflow-hidden group hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-16 h-16 -translate-y-1/4 translate-x-1/4 rotate-12 pointer-events-none">
                        <div className={`w-full h-full ${accent.light} border-l-2 border-b-2 border-brown/20`} />
                      </div>

                      <div className="absolute bottom-0 left-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <ShapeStar color={accent.bg} size={14} />
                      </div>

                      <div className="p-4 md:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="shrink-0 relative">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-brown object-cover group-hover:brightness-105 transition-all duration-300"
                            />
                          ) : (
                            <div
                              className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-brown flex items-center justify-center transition-colors duration-300 ${accent.light} group-hover:${accent.bg}`}
                            >
                              <span className="font-serif font-bold text-xl md:text-2xl text-brown">
                                {getInitials(member.name)}
                              </span>
                            </div>
                          )}
                          {hasLink && (
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-brown flex items-center justify-center ${accent.bg} group-hover:scale-110 transition-transform duration-300`}
                            >
                              <Link2 size={10} className="text-brown" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <h3 className="font-serif font-bold text-lg md:text-xl text-brown group-hover:text-kelas-purple transition-colors truncate">
                            {member.name}
                          </h3>
                          {hasLink && (
                            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                              {member.githubUrl && (
                                <a
                                  href={member.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Lihat repo GitHub"
                                  className="brutal-box-sm w-8 h-8 bg-white border-2 border-brown flex items-center justify-center text-brown hover:bg-kelas-yellow hover:-translate-y-0.5 transition-all"
                                >
                                  <GitBranch size={15} />
                                </a>
                              )}
                              {member.linkedinUrl && (
                                <a
                                  href={member.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Kunjungi profil LinkedIn"
                                  className="brutal-box-sm w-8 h-8 bg-white border-2 border-brown flex items-center justify-center text-brown hover:bg-kelas-purple hover:text-white hover:-translate-y-0.5 transition-all"
                                >
                                  <Briefcase size={15} />
                                </a>
                              )}
                            </div>
                          )}
                          {member.contact && (
                            <p className="font-sans text-xs md:text-sm text-brown-light mt-2 flex items-center justify-center sm:justify-start gap-1.5 border-t-2 border-brown/5 pt-2">
                              <Camera size={12} className="shrink-0" />
                              <span className="truncate">{member.contact}</span>
                            </p>
                          )}
                        </div>
                      </div>
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