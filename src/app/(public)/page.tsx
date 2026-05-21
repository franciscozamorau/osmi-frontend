import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { EventCard } from "@/components/ui/EventCard";
import { Footer } from "@/components/navigation/Footer";
import { Music, Trophy, Theater, PartyPopper, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { normalizeEvent, type NormalizedEvent } from "@/modules/events/utils/normalizer";

async function getEvents(): Promise<NormalizedEvent[]> {
  try {
    const data = await api.get<any>("/v1/events");
    const rawEvents = Array.isArray(data) ? data : data?.events || [];
    return rawEvents.map(normalizeEvent);
  } catch { return []; }
}

const categories = [
  { icon: Music, label: "Conciertos", color: "text-primary", href: "/events" },
  { icon: Trophy, label: "Deportes", color: "text-accent", href: "/events" },
  { icon: Theater, label: "Teatro", color: "text-secondary", href: "/events" },
  { icon: PartyPopper, label: "Festivales", color: "text-warning", href: "/events" },
  { icon: Sparkles, label: "Experiencias", color: "text-primary", href: "/events" },
  { icon: Star, label: "Infantiles", color: "text-success", href: "/events" },
];

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Categorias */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-10">
          <p className="text-xs text-muted-dark uppercase tracking-[0.3em] mb-3">Descubre</p>
          <h2 className="text-3xl lg:text-4xl font-black">Que quieres vivir hoy?</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(({ icon: Icon, label, color, href }) => (
            <Link key={label} href={href} className="glass-card p-5 flex flex-col items-center gap-3 text-center hover:glow-primary transition-all group">
              <Icon size={28} className={`${color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-semibold text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Proximos eventos */}
      {events.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-muted-dark uppercase tracking-[0.3em] mb-2">Eventos</p>
              <h2 className="text-3xl lg:text-4xl font-black">Proximos eventos</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Ver todos &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.slice(0, 4).map((event) => (
              <EventCard key={event.public_id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Confianza */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 w-full text-center">
        <p className="text-xs text-muted-dark uppercase tracking-[0.3em] mb-8">Confian en nosotros</p>
        <div className="flex flex-wrap justify-center gap-10 opacity-40">
          <span className="text-xl font-bold text-muted-dark">Forbes</span>
          <span className="text-xl font-bold text-muted-dark">Billboard</span>
          <span className="text-xl font-bold text-muted-dark">El Pais</span>
          <span className="text-xl font-bold text-muted-dark">TechCrunch</span>
        </div>
      </section>

      <Footer />
    </div>
  );
};