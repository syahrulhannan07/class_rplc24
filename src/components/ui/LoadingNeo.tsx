import { ShapeStar, ShapeDiamond, ShapeSquare, ShapeCircle } from "@/components/ui/Shapes";

type LoadingNeoProps = {
  message?: string;
  variant?: "page" | "card" | "inline";
};

const sizeMap = {
  page: { star: 28, diamond: 24, square: 20, circle: 16, container: "p-10 md:p-16" },
  card: { star: 22, diamond: 18, square: 16, circle: 14, container: "p-8 md:p-10" },
  inline: { star: 16, diamond: 14, square: 12, circle: 10, container: "p-4" },
};

export default function LoadingNeo({ message = "Memuat data...", variant = "page" }: LoadingNeoProps) {
  const s = sizeMap[variant];

  return (
    <div className={`brutal-box bg-white ${s.container} text-center relative overflow-hidden`}>
      <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
        <div className="animate-bounce-soft">
          <ShapeSquare color="bg-kelas-yellow" size={s.square} />
        </div>
        <div className="animate-spin-slow">
          <ShapeDiamond color="bg-kelas-pink" size={s.diamond} />
        </div>
        <div className="animate-pulse-glow rounded-full">
          <ShapeCircle color="bg-beige" size={s.circle} />
        </div>
        <div className="animate-spin-slow" style={{ animationDirection: "reverse" }}>
          <ShapeDiamond color="bg-[#8af5ff]" size={s.diamond} />
        </div>
        <div className="animate-bounce-soft" style={{ animationDelay: "0.3s" }}>
          <ShapeSquare color="bg-kelas-yellow" size={s.square} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="w-2 h-2 bg-kelas-pink border border-brown animate-bounce-soft" />
        <div className="w-2 h-2 bg-kelas-yellow border border-brown animate-bounce-soft" style={{ animationDelay: "0.15s" }} />
        <div className="w-2 h-2 bg-[#8af5ff] border border-brown animate-bounce-soft" style={{ animationDelay: "0.3s" }} />
      </div>
      <p className="font-serif font-bold text-sm md:text-base text-brown-light mt-4 uppercase tracking-wider">{message}</p>
    </div>
  );
}

const widths = ["w-3/4", "w-full", "w-2/3", "w-5/6", "w-1/2"];

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="brutal-box bg-white p-6 space-y-4">
      <div className="h-6 bg-beige/50 border-2 border-brown/30 animate-pulse rounded-none w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-beige/30 border border-brown/20 animate-pulse rounded-none ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}