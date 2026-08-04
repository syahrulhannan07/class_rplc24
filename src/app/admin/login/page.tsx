"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { toast } from "@/lib/toast";
import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCross } from "@/components/ui/Shapes";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Login gagal");
      } else {
        toast.success("Login berhasil!");
        setTimeout(() => router.push("/admin/dashboard"), 600);
      }
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ShapeStar className="absolute top-16 left-[10%]" color="bg-kelas-yellow" size={36} />
        <ShapeDiamond className="absolute top-24 right-[12%]" color="bg-kelas-pink" size={28} />
        <ShapeSquare className="absolute bottom-20 left-[15%]" color="bg-beige" size={24} />
        <ShapeCross className="absolute bottom-24 right-[18%]" color="bg-light-pink" size={22} />
        <ShapeStar className="absolute top-1/3 left-[5%]" color="bg-kelas-yellow" size={18} />
        <ShapeDiamond className="absolute bottom-1/3 right-[6%]" color="bg-beige" size={16} />
      </div>

      <div className="brutal-box bg-white p-8 md:p-10 w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white border-4 border-brown mx-auto mb-4 rounded-full flex items-center justify-center overflow-hidden shadow-[4px_4px_0_0_#1f1c0b]">
            <Image
              src="/logo-rpl2c.png"
              alt="Logo RPL C"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-brown uppercase tracking-tight">Login</h1>
          <p className="font-sans text-base text-brown-light mt-1">Masuk ke panel admin RPL 3C</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-brown p-3 font-sans text-base text-brown bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow"
              placeholder="Masukkan email"
              required
            />
          </div>
          <div>
            <label className="font-serif font-bold text-sm text-brown block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-brown p-3 font-sans text-base text-brown bg-cream outline-none focus:shadow-[4px_4px_0_0_#1f1c0b] transition-shadow"
              placeholder="Masukkan password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full brutal-btn bg-brown text-cream font-display font-bold text-base py-3.5 disabled:opacity-50 hover:bg-kelas-purple transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? "MEMPROSES..." : "MASUK"}
          </button>
        </form>
      </div>
    </div>
  );
}