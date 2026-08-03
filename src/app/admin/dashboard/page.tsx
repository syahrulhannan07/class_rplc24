"use client";

import { useState, useEffect } from "react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import BarChart from "@/components/ui/BarChart";
import DonutChart from "@/components/ui/DonutChart";

type JadwalItem = { id: number; day: string; startTime: string; endTime: string; courseName: string; lecturer: string; room: string };
type KalenderItem = { id: number; eventName: string; eventDate: string; eventTime: string | null; location: string | null; description: string | null };
type PengumumanItem = { id: number; title: string; content: string; publishedAt: string };

const dayLabels: Record<string, string> = { SENIN: "Senin", SELASA: "Selasa", RABU: "Rabu", KAMIS: "Kamis", JUMAT: "Jumat", SABTU: "Sabtu", MINGGU: "Minggu" };
const dayOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ label: string; count: number; color: string }[]>([]);
  const [jadwalPerHari, setJadwalPerHari] = useState<{ label: string; value: number }[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<KalenderItem[]>([]);
  const [latestNews, setLatestNews] = useState<PengumumanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [komposisi, setKomposisi] = useState<{ label: string; value: number; color: string }[]>([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [anggotaRes, pengurusRes, pengumumanRes, jadwalRes, kalenderRes] = await Promise.all([
          fetch("/api/anggota").then((r) => r.json()),
          fetch("/api/pengurus").then((r) => r.json()),
          fetch("/api/pengumuman").then((r) => r.json()),
          fetch("/api/jadwal").then((r) => r.json()),
          fetch("/api/kalender").then((r) => r.json()),
        ]);

        const anggota = anggotaRes.data ?? [];
        const pengurus = pengurusRes.data ?? [];
        const pengumuman = pengumumanRes.data ?? [];
        const jadwal: JadwalItem[] = jadwalRes.data ?? [];
        const kalender: KalenderItem[] = kalenderRes.data ?? [];

        setStats([
          { label: "Total Anggota", count: anggota.length, color: "bg-kelas-yellow" },
          { label: "Total Pengurus", count: pengurus.length, color: "bg-kelas-pink" },
          { label: "Total Pengumuman", count: pengumuman.length, color: "bg-[#8af5ff]" },
        ]);

        const counts: Record<string, number> = {};
        jadwal.forEach((j) => { counts[j.day] = (counts[j.day] || 0) + 1; });
        setJadwalPerHari(
          dayOrder.map((d) => ({
            label: dayLabels[d] ?? d,
            value: counts[d] ?? 0,
          }))
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = kalender
          .filter((e) => new Date(e.eventDate) >= today)
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
          .slice(0, 4);
        setUpcomingEvents(upcoming);

        const sorted = [...pengumuman].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setLatestNews(sorted.slice(0, 3));

        setKomposisi([
          { label: "Anggota", value: anggota.length, color: "#fbbf24" },
          { label: "Pengurus", value: pengurus.length, color: "#f472b6" },
          { label: "Pengumuman", value: pengumuman.length, color: "#22d3ee" },
          { label: "Jadwal", value: jadwal.length, color: "#a78bfa" },
          { label: "Acara", value: kalender.length, color: "#fb923c" },
        ].filter((k) => k.value > 0));
      } catch {
        setStats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <AnimateIn>
        <div className="mb-2">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brown uppercase tracking-tight">Dashboard</h1>
          <p className="font-sans text-sm md:text-base text-brown-light mt-1">Selamat datang di panel admin kelas</p>
        </div>
      </AnimateIn>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((card, i) => (
          <AnimateIn key={card.label} delay={i * 100}>
            <div className="brutal-box bg-white p-6 md:p-8 relative group hover:-translate-y-1 transition-all duration-300">
              <div className={"absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 " + card.color + " border-l-2 border-b-2 border-brown flex items-center justify-center"}>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-brown" />
              </div>
              {loading ? (
                <div className="w-20 h-12 bg-beige border-2 border-brown animate-pulse rounded-none mb-2" />
              ) : (
                <p className="font-display font-extrabold text-4xl md:text-5xl text-brown mb-1 md:mb-2">{card.count}</p>
              )}
              <p className="font-serif font-bold text-base md:text-lg text-brown-light">{card.label}</p>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <AnimateIn delay={200}>
          <BarChart title="Jadwal per Hari" subtitle="Distribusi mata kuliah per hari" data={jadwalPerHari} emptyMessage="Belum ada jadwal" />
        </AnimateIn>

        <AnimateIn delay={250}>
          <DonutChart title="Komposisi Data" subtitle="Distribusi konten kelas" data={komposisi} emptyMessage="Belum ada data" />
        </AnimateIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Upcoming events */}
        <AnimateIn delay={300}>
          <div className="brutal-box bg-white p-4 md:p-6">
            <h3 className="font-display font-bold text-lg md:text-xl text-brown mb-4 uppercase tracking-tight">Acara Terdekat</h3>
            {loading ? (
              <LoadingNeo variant="inline" message="Memuat acara..." />
            ) : upcomingEvents.length === 0 ? (
              <p className="font-sans text-sm text-brown-light text-center py-6">Tidak ada acara mendatang</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-2 border-brown p-3 bg-cream hover:bg-white transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-serif font-bold text-sm text-brown truncate">{event.eventName}</p>
                        {event.location && (
                          <p className="font-sans text-xs text-brown-light mt-0.5">{event.location}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display font-bold text-xs text-brown">
                          {new Date(event.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </p>
                        {event.eventTime && (
                          <p className="font-sans text-xs text-brown-light">{event.eventTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimateIn>

        {/* Latest announcements */}
        <AnimateIn delay={400}>
          <div className="brutal-box bg-white p-4 md:p-6">
            <h3 className="font-display font-bold text-lg md:text-xl text-brown mb-4 uppercase tracking-tight">Pengumuman Terbaru</h3>
          {loading ? (
            <LoadingNeo variant="inline" message="Memuat pengumuman..." />
          ) : latestNews.length === 0 ? (
            <p className="font-sans text-sm text-brown-light text-center py-6">Belum ada pengumuman</p>
          ) : (
            <div className="divide-y-2 divide-brown">
              {latestNews.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif font-bold text-sm text-brown">{item.title}</p>
                    <span className="font-sans text-xs text-brown-light shrink-0">
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-brown-light mt-1 line-clamp-2">
                    {item.content.length > 120 ? item.content.slice(0, 120) + "..." : item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimateIn>
      </div>
    </div>
  );
}
