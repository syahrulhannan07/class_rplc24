"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, CalendarCheck, CalendarX } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import LoadingNeo from "@/components/ui/LoadingNeo";

type Event = { id: number; eventName: string; eventDate: string; eventTime: string | null; location: string | null; description: string | null };

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function EventCard({ ev, index }: { ev: Event; index: number }) {
  const d = new Date(ev.eventDate);
  return (
    <AnimateIn delay={index * 60}>
      <div className="brutal-box bg-white hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1f1c0b] transition-all duration-300 group">
        <div className="flex">
          <div className="w-20 md:w-24 bg-kelas-yellow border-r-4 border-brown flex flex-col items-center justify-center p-2 shrink-0 group-hover:bg-kelas-pink transition-colors duration-300">
            <span className="font-serif font-bold text-xs text-brown uppercase">{monthNames[d.getMonth()]}</span>
            <span className="font-serif font-extrabold text-2xl md:text-3xl text-brown leading-none mt-1">{d.getDate()}</span>
            <span className="font-serif font-bold text-[10px] text-brown-light uppercase mt-1">{d.getFullYear()}</span>
          </div>
          <div className="flex-1 p-3 md:p-4">
            <h3 className="font-serif font-bold text-base md:text-lg text-brown group-hover:text-kelas-purple transition-colors">{ev.eventName}</h3>
            <div className="flex flex-wrap gap-3 mt-1.5">
              {ev.eventTime && (
                <span className="font-sans text-xs text-brown-light flex items-center gap-1">
                  <Clock size={12} className="text-kelas-purple" /> {ev.eventTime}
                </span>
              )}
              {ev.location && (
                <span className="font-sans text-xs text-brown-light flex items-center gap-1">
                  <MapPin size={12} className="text-kelas-yellow" /> {ev.location}
                </span>
              )}
            </div>
            {ev.description && (
              <p className="font-sans text-xs md:text-sm text-brown-light mt-2 line-clamp-2 border-l-2 border-beige pl-2">{ev.description}</p>
            )}
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

export default function KalenderPage() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kalender")
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = data
    .filter(ev => new Date(ev.eventDate) >= today)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const past = data
    .filter(ev => new Date(ev.eventDate) < today)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b-4 border-brown relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16">
          <AnimateIn>
            <div className="bg-light-pink border-2 border-brown px-3 py-1.5 inline-block mb-3">
              <span className="font-serif font-bold text-xs md:text-sm text-brown uppercase tracking-wider">TAHUN AJARAN 2024/2025</span>
            </div>
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-brown">KALENDER ACARA</h1>
            <p className="font-sans text-base md:text-lg text-brown-light mt-1 md:mt-2">Jadwal acara dan kegiatan kelas RPL 3C</p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {loading ? (
            <LoadingNeo variant="page" message="Memuat kalender acara..." />
          ) : data.length === 0 ? (
            <AnimateIn>
              <div className="brutal-box bg-white p-8 md:p-12 text-center">
                <CalendarX size={48} strokeWidth={1.5} className="mx-auto text-brown/30 mb-4" />
                <p className="font-serif text-xl md:text-2xl text-brown">Belum ada acara.</p>
                <p className="font-sans text-sm md:text-base text-brown-light mt-2">Acara akan muncul di sini.</p>
              </div>
            </AnimateIn>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mb-12">
                  <AnimateIn>
                    <div className="flex items-center gap-3 mb-6">
                      <CalendarCheck size={24} className="text-kelas-purple" />
                      <h2 className="font-serif font-extrabold text-2xl md:text-4xl text-brown">AKAN DATANG</h2>
                      <span className="brutal-tag bg-kelas-yellow">{upcoming.length} acara</span>
                    </div>
                  </AnimateIn>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {upcoming.map((ev, i) => (
                      <EventCard key={ev.id} ev={ev} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <AnimateIn>
                    <div className="flex items-center gap-3 mb-6">
                      <CalendarX size={24} className="text-brown-light" />
                      <h2 className="font-serif font-extrabold text-2xl md:text-4xl text-brown">SUDAH LEWAT</h2>
                      <span className="brutal-tag bg-beige">{past.length} acara</span>
                    </div>
                  </AnimateIn>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-70">
                    {past.map((ev, i) => (
                      <EventCard key={ev.id} ev={ev} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}