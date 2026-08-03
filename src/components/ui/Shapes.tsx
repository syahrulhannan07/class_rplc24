export function ShapeStar({ className = "", color = "bg-kelas-yellow", size = 24 }: { className?: string; color?: string; size?: number }) {
  return (
    <div className={`${className} ${color} border-2 border-brown flex items-center justify-center`} style={{ width: size, height: size }}>
      <div className="text-brown font-bold text-xs leading-none" style={{ fontSize: size * 0.4 }}>
        ✦
      </div>
    </div>
  );
}

export function ShapeTriangle({ className = "", color = "bg-kelas-pink", size = 24, direction = "up" }: { className?: string; color?: string; size?: number; direction?: "up" | "down" | "left" | "right" }) {
  const rotate = { up: "rotate-0", down: "rotate-180", left: "-rotate-90", right: "rotate-90" }[direction];
  return (
    <div className={`${className}`} style={{ width: 0, height: 0, borderLeft: `${size * 0.5}px solid transparent`, borderRight: `${size * 0.5}px solid transparent`, borderBottom: `${size}px solid #1f1c0b` }}>
      <div className={`${rotate}`} />
    </div>
  );
}

export function ShapeDiamond({ className = "", color = "bg-[#8af5ff]", size = 24 }: { className?: string; color?: string; size?: number }) {
  return (
    <div className={`${className} ${color} border-2 border-brown animate-spin-slow`} style={{ width: size, height: size, transform: `rotate(45deg)` }}>
      <div className="flex items-center justify-center" style={{ transform: `rotate(-45deg)`, width: size, height: size }}>
        <div className="w-1.5 h-1.5 bg-brown" />
      </div>
    </div>
  );
}

export function ShapeSquare({ className = "", color = "bg-beige", size = 20 }: { className?: string; color?: string; size?: number }) {
  return (
    <div className={`${className} ${color} border-2 border-brown`} style={{ width: size, height: size }}>
      <div className="w-1 h-1 bg-brown m-0.5" />
    </div>
  );
}

export function ShapeCircle({ className = "", color = "bg-kelas-yellow", size = 16 }: { className?: string; color?: string; size?: number }) {
  return (
    <div className={`${className} ${color} border-2 border-brown rounded-full`} style={{ width: size, height: size }} />
  );
}

export function ShapeCross({ className = "", color = "bg-kelas-purple", size = 20 }: { className?: string; color?: string; size?: number }) {
  return (
    <div className={`${className} ${color} border-2 border-brown flex items-center justify-center`} style={{ width: size, height: size }}>
      <span className="text-brown font-bold" style={{ fontSize: size * 0.6 }}>+</span>
    </div>
  );
}