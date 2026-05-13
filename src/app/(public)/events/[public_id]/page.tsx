// src/app/(public)/events/[public_id]/page.tsx

import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

import BuyTicketCard from "@/components/events/BuyTicketCard";
import { Navbar } from "@/components/navigation/Navbar";
import { api } from "@/lib/api";

import {
  normalizeEvent,
  type NormalizedEvent,
} from "@/modules/events/utils/normalizer";

// ============================================================
// FETCH CACHEADO (evita requests duplicados)
// ============================================================
const getEvent = cache(
  async (public_id: string): Promise<NormalizedEvent | null> => {
    try {
      const raw = await api.get<any>(`/v1/events/${public_id}`);

      return normalizeEvent(raw);
    } catch (error) {
      console.error("Error fetching event:", error);

      return null;
    }
  }
);

// ============================================================
// SEO DINÁMICO
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ public_id: string }>;
}): Promise<Metadata> {
  const { public_id } = await params;

  try {
    const event = await getEvent(public_id);

    if (!event) {
      return {
        title: "Evento no encontrado - osmi",
      };
    }

    return {
      title: `${event.name} - Osmi`,
      description:
        event.description ||
        `Compra boletos para ${event.name} en ${event.location}. ¡Vive la experiencia con osmi!`,

      openGraph: {
        title: `${event.name} - Osmi Tickets`,
        description: event.description,
        images: event.image_url ? [event.image_url] : [],
        type: "website",
        locale: "es_MX",
      },
    };
  } catch {
    return {
      title: "Evento no encontrado - osmi",
    };
  }
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================
export default async function EventPage({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;

  const event = await getEvent(public_id);

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.start_date).toLocaleDateString(
    "es-MX",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedTime = new Date(event.start_date).toLocaleTimeString(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {event.image_url ? (
          <>
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              className="object-cover scale-105"
              priority
              sizes="100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary via-primary/30 to-background flex items-center justify-center">
            <span className="text-8xl font-bold text-gradient opacity-20">
              OSMI
            </span>
          </div>
        )}

        {/* INFO SOBRE HERO */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="max-w-4xl">
            <span className="inline-block rounded-full bg-primary/20 backdrop-blur-md px-4 py-1 text-xs font-medium text-primary ring-1 ring-primary/30 mb-4">
              {event.min_price > 0
                ? `Desde $${event.min_price.toLocaleString("es-MX")} MXN`
                : "Boletos pronto disponibles"}
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
              {event.name}
            </h1>

            <div className="flex flex-wrap gap-4 text-muted">
              <div className="flex items-center gap-2">
                <Calendar
                  size={18}
                  className="text-secondary"
                />

                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock
                  size={18}
                  className="text-secondary"
                />

                <span>{formattedTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-secondary"
                />

                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
          {/* DESCRIPCIÓN */}
          {event.description && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Sobre el evento
              </h2>

              <p className="text-muted leading-relaxed text-lg">
                {event.description}
              </p>
            </section>
          )}

          {/* LINEUP */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Lineup
            </h2>

            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold">
                {event.name.charAt(0)}
              </div>

              <div>
                <p className="font-semibold text-lg">
                  {event.name}
                </p>

                <p className="text-muted text-sm">
                  Artista principal
                </p>
              </div>
            </div>
          </section>

          {/* UBICACIÓN */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Ubicación
            </h2>

            <div className="glass-card h-64 flex items-center justify-center text-muted">
              <div className="text-center">
                <MapPin
                  size={32}
                  className="mx-auto mb-2 text-secondary"
                />

                <p className="font-semibold text-foreground">
                  {event.location}
                </p>

                <p className="text-sm">
                  Mapa interactivo próximamente
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* DERECHA — CLIENT COMPONENT */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BuyTicketCard
              eventId={event.public_id}
              eventName={event.name}
              formattedDate={formattedDate}
              formattedTime={formattedTime}
              location={event.location}
            />
          </div>
        </div>
      </div>

      {/* RELACIONADOS */}
      <section className="bg-background-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-8">
            También te puede interesar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card h-48 flex items-center justify-center text-muted-dark"
              >
                Próximamente
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-dark">
          © 2026 osmi. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}