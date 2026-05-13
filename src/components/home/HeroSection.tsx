// src/components/home/HeroSection.tsx
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 md:py-48 overflow-hidden hero-grid">
      {/* Gradiente decorativo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] bg-primary animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl">
        <span className="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-muted ring-1 ring-inset ring-white/10 mb-8">
          La nueva era del ticketing digital
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Vive momentos
          <br />
          <span className="text-gradient">inolvidables.</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          La experiencia de boletos más inteligente, rápida y segura. Descubre eventos, 
          compra al instante y olvídate de las complicaciones.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all glow-hover"
          >
            Explorar eventos
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white/5 px-8 py-3 text-sm font-semibold text-foreground ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-all"
          >
            Unirme a osmi
          </Link>
        </div>
      </div>
    </section>
  );
};