// src/app/(public)/events/page.tsx
import { Metadata } from "next";
import { api } from "@/lib/api";
import { Navbar } from "@/components/navigation/Navbar";
import { EventCard } from "@/components/ui/EventCard";
import { normalizeEvent, type NormalizedEvent } from "@/modules/events/utils/normalizer";

export const metadata: Metadata = {
  title: "Explorar Eventos - osmi",
  description: "Descubre los mejores eventos, conciertos, festivales y más en osmi.",
};

export default async function EventsPage() {
  const rawEvents = await api.get<any>("/v1/events");
  const eventList: NormalizedEvent[] = Array.isArray(rawEvents)
    ? rawEvents.map(normalizeEvent)
    : rawEvents?.events
    ? rawEvents.events.map(normalizeEvent)
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Explorar eventos</h1>
        <p className="text-muted mb-8">Descubre experiencias increíbles cerca de ti.</p>

        {eventList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eventList.map((event) => (
              <EventCard key={event.public_id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No hay eventos disponibles en este momento.</p>
          </div>
        )}
      </main>
    </div>
  );
}