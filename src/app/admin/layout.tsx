"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  Images,
  UserCircle,
  Clock,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import {
  ShapeStar,
  ShapeTriangle,
  ShapeDiamond,
  ShapeSquare,
  ShapeCircle,
  ShapeCross,
} from "@/components/ui/Shapes";
import ToastContainer from "@/components/ui/Toast";

const SIDEBAR_W = "w-80";
const SIDEBAR_W_NUM = 320;
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/pengurus", label: "Pengurus", Icon: Users },
  { href: "/admin/jadwal", label: "Jadwal", Icon: Calendar },
  { href: "/admin/pengumuman", label: "Pengumuman", Icon: Megaphone },
  { href: "/admin/galeri", label: "Galeri", Icon: Images },
  { href: "/admin/anggota", label: "Anggota", Icon: UserCircle },
  { href: "/admin/kalender", label: "Kalender", Icon: Clock },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      queueMicrotask(() => setSidebarOpen(false));
    }
  }, []);

  const floatingShapes = [
    { Comp: ShapeStar, props: { color: "bg-kelas-yellow", size: 48, className: "animate-float" }, style: { top: "5%", left: "3%" } },
    { Comp: ShapeTriangle, props: { color: "bg-kelas-pink", size: 36, direction: "up" as const }, style: { top: "12%", right: "2%" } },
    { Comp: ShapeDiamond, props: { color: "bg-[#8af5ff]", size: 28, className: "animate-spin-slow" }, style: { top: "20%", left: "1%" } },
    { Comp: ShapeSquare, props: { color: "bg-beige", size: 24 }, style: { top: "30%", right: "4%" } },
    { Comp: ShapeCircle, props: { color: "bg-kelas-yellow", size: 18 }, style: { top: "42%", left: "2%" } },
    { Comp: ShapeCross, props: { color: "bg-kelas-purple", size: 22 }, style: { top: "55%", right: "3%" } },
    { Comp: ShapeStar, props: { color: "bg-kelas-pink", size: 32, className: "animate-float animate-delay-200" }, style: { bottom: "15%", left: "2%" } },
    { Comp: ShapeTriangle, props: { color: "bg-[#8af5ff]", size: 26, direction: "down" as const }, style: { bottom: "8%", right: "2%" } },
    { Comp: ShapeDiamond, props: { color: "bg-beige", size: 20, className: "animate-spin-slow" }, style: { bottom: "25%", left: "4%" } },
    { Comp: ShapeSquare, props: { color: "bg-kelas-yellow", size: 16 }, style: { bottom: "35%", right: "5%" } },
  ];

  function navLinkClass(active: boolean): string {
    const base = "brutal-btn flex items-center gap-3 px-4 py-3.5 transition-all duration-200 group relative";
    if (active) return base + " bg-kelas-yellow shadow-[4px_4px_0_0_#1f1c0b]";
    return base + " bg-white hover:bg-kelas-pink hover:shadow-[6px_6px_0_0_#1f1c0b]";
  }

  function navLabelClass(active: boolean): string {
    const base = "font-serif font-bold text-sm text-brown transition-colors whitespace-nowrap";
    if (!active) return base + " group-hover:text-kelas-purple";
    return base;
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
    }
    router.push("/admin/login");
  }

  return (
    <>
      <ToastContainer />
      {isLoginPage ? <>{children}</> : (
      <div className="min-h-screen bg-cream relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {floatingShapes.map((shape, index) => {
          const C = shape.Comp;
          return (
            <div key={index} className="absolute" style={shape.style}>
              <C {...shape.props} />
            </div>
          );
        })}
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-brown/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={
          "fixed left-0 top-0 h-full z-40 bg-white border-r-4 border-brown transition-all duration-300 ease-out overflow-hidden " +
          (sidebarOpen ? SIDEBAR_W + " brutal-box" : "w-0")
        }
        style={{ boxShadow: sidebarOpen ? "8px 0 0 0 #1f1c0b" : "none" }}
      >
        <div className={"flex flex-col h-full " + SIDEBAR_W}>
          <div className="flex items-center gap-3 px-5 py-5 border-b-2 border-brown">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group flex-1 min-w-0">
              <div className="w-10 h-10 bg-white border-3 border-brown rounded-full flex items-center justify-center overflow-hidden group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <Image
                  src="/logo-rpl2c.png"
                  alt="Logo RPL C"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-sm text-brown uppercase tracking-tight group-hover:text-kelas-purple transition-colors truncate">
                ADMIN RPL C
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto" aria-label="Navigasi admin">
            {navItems.map((item, index) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(active)}
                  style={{ animationDelay: String(index * 50) + "ms" }}
                  onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <item.Icon size={20} strokeWidth={2.5} className="shrink-0" />
                  <span className={navLabelClass(active)}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t-2 border-brown p-3">
            <button
              onClick={handleLogout}
              className="brutal-btn flex items-center gap-3 px-4 py-3.5 w-full bg-white hover:bg-kelas-pink transition-colors group"
            >
              <LogOut size={20} strokeWidth={2.5} className="shrink-0 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-serif font-bold text-sm text-brown group-hover:text-kelas-purple transition-colors whitespace-nowrap">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop toggle — always visible on the left edge */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-[18px] z-50 brutal-box-sm w-9 h-9 bg-kelas-yellow border-3 border-brown flex items-center justify-center hover:scale-105 active:translate-y-0.5 transition-all hidden lg:flex"
        style={{ left: sidebarOpen ? SIDEBAR_W_NUM + "px" : "4px", transition: "left 0.3s ease" }}
        aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      <main className={(sidebarOpen ? "lg:ml-[320px]" : "") + " min-h-screen relative z-10 transition-all duration-300 ease-out"}>
        {children}
      </main>

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 brutal-box-sm w-12 h-12 bg-kelas-yellow border-3 border-brown flex items-center justify-center lg:hidden hover:scale-105 active:translate-y-0.5 transition-all"
        aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
      )}
    </>
  );
}