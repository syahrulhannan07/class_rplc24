"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";
import { ShapeStar, ShapeDiamond } from "@/components/ui/Shapes";

const dayLabels: Record<string, string> = { SENIN: "Senin", SELASA: "Selasa", RABU: "Rabu", KAMIS: "Kamis", JUMAT: "Jumat", SABTU: "Sabtu", MINGGU: "Minggu" };

type Schedule = { id: number; day: string; startTime: string; endTime: string; courseName: string; lecturer: string; room: string; jenis: string };

const jenisColors: Record<string, string> = {
  TEORI: "bg-kelas-yellow",
  PRAKTIKUM: "bg-beige",
};

const jenisLabels: Record<string, string> = {
  TEORI: "Teori",
  PRAKTIKUM: "Praktikum",
};

const days = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

export default function JadwalPage() {
  const [data, setData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDay, setFilterDay] = useState("");

  useEffect(() => {
    fetch("/api/jadwal")
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterDay ? data.filter(s => s.day === filterDay) : data;
  const times = [...new Set(filtered.map(s => s.startTime))].sort();
  const grouped: Record<string, Record<string, Schedule[]>> = {};
  for (const s of filtered) {
    if (!grouped[s.day]) grouped[s.day] = {};
    if (!grouped[s.day][s.startTime]) grouped[s.day][s.startTime] = [];
    grouped[s.day][s.startTime].push(s);
  }

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ShapeStar className="absolute top-8 left-[5%]" color="bg-kelas-yellow" size={26} />
          <ShapeDiamond className="absolute top-10 right-[8%]" color="bg-kelas-pink" size={22} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16 relative">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-3">
              <Calendar size={24} className="text-kelas-purple" />
              <span className="brutal-tag bg-kelas-yellow">{data.length} sesi</span>
            </div>
            <p className="font-serif font-bold text-xs md:text-base text-kelas-purple uppercase tracking-widest mb-1 md:mb-2">
              SEMESTER GANJIL 2026/2027
            </p>
            <h1 className="font-serif font-extrabold text-4xl md:text-7xl text-brown leading-tight">JADWAL KULIAH</h1>
          </AnimateIn>
        </div>
      </section>

      <section className="py-4 md:py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <AnimateIn>
            <div className="brutal-box-sm bg-white flex flex-wrap items-center gap-2 md:gap-4 p-2">
              <select
                value={filterDay}
                onChange={e => setFilterDay(e.target.value)}
                className="flex-1 bg-transparent font-serif text-sm md:text-base text-brown outline-none cursor-pointer p-1 md:p-2"
              >
                <option value="">SEMUA HARI</option>
                {days.map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
              </select>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {loading ? (
            <LoadingNeo variant="page" message="Memuat jadwal kuliah..." />
          ) : filtered.length === 0 ? (
            <AnimateIn>
              <div className="brutal-box bg-white p-8 md:p-12 text-center">
                <Calendar size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-xl md:text-2xl text-brown">Belum ada jadwal.</p>
              </div>
            </AnimateIn>
          ) : (
            <div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="font-serif text-base text-brown border-2 border-brown px-4 py-3 bg-kelas-yellow w-20">JAM</th>
                      {days.map(day => (
                        <th key={day} className="font-serif text-base text-brown border-2 border-brown px-4 py-3 bg-kelas-yellow">
                          {dayLabels[day]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {times.map(time => (
                      <tr key={time}>
                        <td className="font-serif text-base text-brown border-2 border-brown px-4 py-3 text-center bg-light-cream font-bold">{time}</td>
                        {days.map(day => {
                          const items = grouped[day]?.[time] ?? [];
                          return (
                            <td key={day} className="border-2 border-brown p-2 align-top">
                              {items.map((s, i) => (
                                <div key={i} className="bg-white border-2 border-brown p-3 h-full">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-serif text-lg text-brown font-bold leading-tight">{s.courseName}</p>
                                    <span className={`brutal-tag ${jenisColors[s.jenis] ?? "bg-cream"} shrink-0 text-[10px]`}>
                                      {jenisLabels[s.jenis] ?? s.jenis}
                                    </span>
                                  </div>
                                  <p className="font-sans text-sm text-brown-light mt-1">{s.lecturer}</p>
                                  <p className="font-serif text-xs text-brown mt-1 font-bold">{s.room} | {s.startTime}-{s.endTime}</p>
                                </div>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {days.filter(d => !filterDay || d === filterDay).map(day => {
                  const dayItems = filtered.filter(s => s.day === day);
                  if (dayItems.length === 0) return null;
                  return (
                    <AnimateIn key={day}>
                      <div className="brutal-box bg-white overflow-hidden">
                        <div className="bg-kelas-yellow border-b-4 border-brown px-4 py-2">
                          <span className="font-serif font-bold text-base text-brown">{dayLabels[day]}</span>
                        </div>
                        {dayItems.map((s, i) => (
                          <div key={i} className="border-b-2 border-brown/20 last:border-b-0 px-4 py-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-serif font-bold text-sm text-brown flex-1">{s.courseName}</p>
                              <span className={`brutal-tag ${jenisColors[s.jenis] ?? "bg-cream"} shrink-0 text-[10px]`}>
                                {jenisLabels[s.jenis] ?? s.jenis}
                              </span>
                            </div>
                            <p className="font-sans text-xs text-brown-light mt-1">{s.lecturer}</p>
                            <p className="font-serif text-xs text-brown mt-1">{s.room} | {s.startTime}-{s.endTime}</p>
                          </div>
                        ))}
                      </div>
                    </AnimateIn>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-10 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <AnimateIn>
            <div className="brutal-box bg-white p-4 md:p-6">
              <h3 className="font-serif text-sm md:text-base text-brown mb-3 font-bold">KETERANGAN</h3>
              <div className="flex flex-wrap gap-4 md:gap-6">
                {[
                  { label: "Teori (Kuliah)", color: "bg-kelas-yellow" },
                  { label: "Praktikum (Laboratorium)", color: "bg-beige" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 md:gap-3">
                    <div className={`w-5 h-5 md:w-6 md:h-6 ${item.color} border-2 border-brown`} />
                    <span className="font-serif text-xs md:text-base text-brown">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}