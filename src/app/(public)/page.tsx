// src/app/(public)/page.tsx

import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { EventCard } from "@/components/ui/EventCard";

import { api } from "@/lib/api";

import {
  normalizeEvent,
  type NormalizedEvent,
} from "@/modules/events/utils/normalizer";

async function getEvents(): Promise<NormalizedEvent[]> {
  try {
    const data = await api.get<any>("/v1/events");

    const rawEvents = Array.isArray(data)
      ? data
      : data?.events || [];

    return rawEvents.map(normalizeEvent);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />

      <HeroSection />

      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 w-full fade-bottom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Próximos eventos
            </h2>

            <a
              href="/events"
              className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
            >
              Ver todos →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.slice(0, 4).map((event) => (
              <EventCard
                key={event.public_id}
                event={event}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-dark">
          © 2026 osmi. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}