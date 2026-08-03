import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import PengurusSection from "@/components/public/PengurusSection";
import AlbumAcaraSection from "@/components/public/AlbumAcaraSection";
import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCircle, ShapeCross, ShapeTriangle } from "@/components/ui/Shapes";

export default function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-cream border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-16 left-[8%] animate-float" color="bg-kelas-yellow" size={32} />
          <ShapeDiamond className="absolute top-32 right-[12%] animate-spin-slow" color="bg-kelas-pink" size={28} />
          <ShapeSquare className="absolute bottom-24 left-[15%] animate-float" color="bg-[#8af5ff]" size={24} />
          <ShapeCross className="absolute bottom-20 right-[20%] animate-float" color="bg-kelas-purple" size={28} />
          <ShapeCircle className="absolute top-40 left-[35%] animate-float" color="bg-beige" size={20} />
          <ShapeTriangle className="absolute top-24 right-[30%] animate-float" color="" size={28} direction="up" />
          <ShapeSquare className="absolute bottom-32 right-[8%] animate-spin-slow" color="bg-kelas-yellow" size={18} />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-6 text-center relative">
          <AnimateIn>
            <div className="brutal-box-sm bg-kelas-yellow inline-block px-3 md:px-5 py-1.5 md:py-2 mb-4 md:mb-6">
              <span className="font-display font-bold text-xs md:text-base text-brown uppercase tracking-widest">
                Angkatan 2024
              </span>
            </div>
          </AnimateIn>
          <AnimateIn delay={150}>
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-brown leading-tight mb-2 md:mb-4">
              SELAMAT DATANG
            </h1>
          </AnimateIn>
          <AnimateIn delay={300}>
            <div className="inline-block brutal-box px-4 md:px-6 py-2 md:py-3 bg-kelas-purple mb-2">
              <span className="font-serif font-extrabold text-4xl md:text-7xl text-white">
                DI KELAS RPL C
              </span>
            </div>
          </AnimateIn>
          <AnimateIn delay={450}>
            <div className="max-w-2xl mx-auto mt-6 md:mt-8 mb-8 md:mb-10">
              <div className="bg-cream/80 border-l-4 border-brown px-4 md:px-6 py-3 md:py-4">
                <p className="font-sans font-medium text-sm md:text-xl text-brown-light">
                  Wadah kolaborasi, inovasi, dan pengembangan karya digital mahasiswa Rekayasa Perangkat Lunak C. Bersama membangun solusi lewat kode.
                </p>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn delay={600}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link href="/pengurus" className="brutal-btn bg-kelas-yellow text-brown font-display font-bold text-base md:text-xl px-6 md:px-10 py-3 md:py-4 w-full sm:w-auto text-center">
                INFORMASI LEBIH LANJUT
              </Link>
              <Link href="/anggota" className="brutal-btn bg-cream text-brown font-display font-bold text-base md:text-xl px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto text-center">
                ANGGOTA
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* WALI DOSEN */}
      <section className="bg-cream border-b-4 border-brown py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeDiamond className="absolute top-10 left-[5%] animate-spin-slow" color="bg-kelas-yellow" size={24} />
          <ShapeStar className="absolute top-20 right-[8%] animate-float" color="bg-light-pink" size={28} />
          <ShapeSquare className="absolute bottom-12 left-[20%] animate-float" color="bg-beige" size={22} />
          <ShapeCircle className="absolute bottom-16 right-[15%] animate-float" color="bg-kelas-pink" size={18} />
          <ShapeCross className="absolute top-1/2 right-[4%] animate-float" color="bg-[#8af5ff]" size={20} />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <AnimateIn>
            <div className="brutal-box bg-white flex flex-col md:flex-row">
              <div className="w-full md:w-[340px] bg-kelas-yellow border-b-4 md:border-b-0 md:border-r-4 border-brown flex items-center justify-center p-6 md:p-8 shrink-0">
                <div className="w-full max-w-[270px] aspect-[270/245] bg-beige border-4 border-brown flex items-center justify-center relative overflow-hidden">
                  <ShapeStar className="absolute top-2 right-2" color="bg-kelas-yellow" size={16} />
                  <span className="font-serif font-bold text-4xl md:text-5xl text-brown">AW</span>
                </div>
              </div>
              <div className="flex-1 p-6 md:p-10">
                <p className="font-serif font-bold text-xs md:text-base text-kelas-purple uppercase tracking-widest mb-1 md:mb-2">
                  WALI DOSEN
                </p>
                <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-brown leading-tight mb-4 md:mb-6">
                  ARIF MAULANA YUSUF, S.KOM., M.KOM.
                </h2>
                <div className="border-l-4 border-brown pl-3 md:pl-4">
                  <p className="font-sans font-medium text-sm md:text-xl text-brown-light italic">
                    &quot;Pendidikan bukan hanya soal nilai di atas kertas, tapi tentang bagaimana kita
                    berani bereksperimen dan belajar dari kegagalan. Mari kita bangun kelas yang
                    inovatif!&quot;
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* INFORMASI KELAS */}
      <section className="bg-[#fcf3d8] border-b-4 border-brown py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeSquare className="absolute top-8 left-[10%] animate-float" color="bg-kelas-yellow" size={26} />
          <ShapeCross className="absolute top-16 right-[6%] animate-spin-slow" color="bg-kelas-pink" size={24} />
          <ShapeStar className="absolute bottom-16 left-[6%] animate-float" color="bg-[#8af5ff]" size={30} />
          <ShapeDiamond className="absolute bottom-20 right-[10%] animate-spin-slow" color="bg-beige" size={22} />
          <ShapeCircle className="absolute top-1/3 right-[3%] animate-float" color="bg-kelas-yellow" size={14} />
          <ShapeTriangle className="absolute top-1/2 left-[3%] animate-float" color="" size={24} direction="down" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <AnimateIn>
                <div className="bg-[#8af5ff] border-2 border-brown px-3 py-1.5 inline-block mb-3 md:mb-4">
                  <span className="font-serif font-bold text-xs md:text-sm text-brown uppercase tracking-wider">
                    IDENTITAS VISUAL
                  </span>
                </div>
              </AnimateIn>
              <AnimateIn delay={150}>
                <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-brown leading-tight mb-6 md:mb-8">
                  FILOSOFI LOGO KELAS
                </h2>
              </AnimateIn>
              <div className="space-y-4">
                <AnimateIn delay={200}>
                  <div className="brutal-box-sm bg-white p-4 md:p-5">
                    <h3 className="font-serif font-bold text-lg md:text-xl text-brown mb-1">HURUF C</h3>
                    <p className="font-sans text-sm md:text-base text-brown-light">
                      Identitas kelas RPL C 2024, sekaligus melambangkan Collaboration, Creativity, dan Continuous Learning.
                    </p>
                  </div>
                </AnimateIn>
                <AnimateIn delay={350}>
                  <div className="brutal-box-sm bg-white p-4 md:p-5">
                    <h3 className="font-serif font-bold text-lg md:text-xl text-brown mb-1">BENTUK PYTHON</h3>
                    <p className="font-sans text-sm md:text-base text-brown-light">
                      Semangat pemrograman, logika berpikir, kemampuan beradaptasi, dan inovasi teknologi.
                    </p>
                  </div>
                </AnimateIn>
                <AnimateIn delay={350}>
                  <div className="brutal-box-sm bg-white p-4 md:p-5">
                    <h3 className="font-serif font-bold text-lg md:text-xl text-brown mb-1">GEAR</h3>
                    <p className="font-sans text-sm md:text-base text-brown-light">
                      Rekayasa perangkat lunak, kerja sama tim, disiplin, dan proses pengembangan yang terstruktur.
                    </p>
                  </div>
                </AnimateIn>
              </div>
            </div>
            <AnimateIn delay={250} className="h-full">
              <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-[320px] md:max-w-[420px] aspect-square bg-kelas-yellow border-4 border-brown rounded-full shadow-[8px_8px_0_0_#1f1c0b] flex items-center justify-center relative overflow-hidden animate-bounce-soft">
                  <ShapeDiamond className="absolute top-3 right-3 animate-spin-slow" color="bg-kelas-pink" size={20} />
                  <div className="w-[80%] h-[80%] bg-white border-4 border-brown rounded-full overflow-hidden">
                    <Image
                      src="/logo-rpl2c.png"
                      alt="Logo RPL 2C"
                      width={420}
                      height={420}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* PENGURUS */}
      <PengurusSection />

      {/* GALERI */}
      <AlbumAcaraSection />

      {/* EKSPLORASI */}
      <section className="bg-[#fcf3d8] border-b-4 border-brown py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-10 left-[3%] animate-float" color="bg-kelas-yellow" size={30} />
          <ShapeDiamond className="absolute top-6 right-[4%] animate-spin-slow" color="bg-kelas-pink" size={24} />
          <ShapeSquare className="absolute bottom-16 left-[15%] animate-float" color="bg-beige" size={22} />
          <ShapeCross className="absolute bottom-12 right-[6%] animate-float" color="bg-[#8af5ff]" size={20} />
          <ShapeCircle className="absolute top-1/3 left-[2%] animate-float" color="bg-kelas-purple" size={14} />
          <ShapeTriangle className="absolute bottom-1/3 right-[3%] animate-float" color="" size={22} direction="left" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-4 md:mb-2">
            <div>
              <AnimateIn>
                <div className="bg-light-pink border-2 border-brown px-3 py-1.5 inline-block mb-2 md:mb-3">
                  <span className="font-serif font-bold text-xs md:text-sm text-brown uppercase tracking-wider">
                    NAVIGASI UTAMA
                  </span>
                </div>
              </AnimateIn>
              <AnimateIn delay={150}>
                <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-brown">
                  EKSPLORASI RUANG KELAS
                </h2>
              </AnimateIn>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mt-6 md:mt-10">
            {[
              { href: "/jadwal", title: "JADWAL", desc: "Pantau mata pelajaran dan agenda kelas harian secara real-time.", badge: "LIHAT DETAIL", color: "bg-[#8af5ff]", delay: 0 },
              { href: "/pengumuman", title: "PENGUMUMAN", desc: "Informasi terbaru seputar tugas, ujian, dan kegiatan mendadak.", badge: "TERBARU (3)", color: "bg-kelas-pink", delay: 100 },
              { href: "/galeri", title: "GALERI", desc: "Dokumentasi momen seru dan proyek kreatif yang telah kita selesaikan.", badge: "250+ FOTO", color: "bg-kelas-yellow", delay: 200 },
              { href: "/anggota", title: "ANGGOTA", desc: "Kenali lebih dekat teman-teman sekelas dan para pengajar kita.", badge: "32 SISWA", color: "bg-cream", delay: 300 },
              { href: "/kalender", title: "ACARA", desc: "Daftar festival sekolah, karyawisata, dan kompetisi yang akan datang.", badge: "LIHAT KALENDER", color: "bg-[#006970]", delay: 400 },
            ].map((card) => (
              <AnimateIn key={card.title} delay={card.delay}>
                <Link
                  href={card.href}
                  className={`${card.color} border-4 border-brown brutal-box p-4 md:p-5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all group flex flex-col relative overflow-hidden`}
                >
                  <ShapeStar className="absolute top-2 right-2" color={card.color === 'bg-[#006970]' ? 'bg-white' : 'bg-brown'} size={12} />
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-brown brutal-box-sm flex items-center justify-center mb-3 md:mb-4">
                    <span className="font-serif font-bold text-lg md:text-xl text-brown">{card.title.charAt(0)}</span>
                  </div>
                  <h3 className={`font-serif font-bold text-lg md:text-xl mb-1 md:mb-2 ${card.color === 'bg-[#006970]' ? 'text-white' : 'text-brown'}`}>
                    {card.title}
                  </h3>
                  <p className={`font-sans text-xs md:text-sm flex-1 ${card.color === 'bg-[#006970]' ? 'text-white/80' : 'text-brown-light'}`}>
                    {card.desc}
                  </p>
                  <p className={`font-serif font-bold text-xs mt-2 md:mt-3 ${card.color === 'bg-[#006970]' ? 'text-white' : 'text-brown'} group-hover:underline`}>
                    {card.badge} &rarr;
                  </p>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}