"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { api } from "@/lib/api";
import {
  normalizeEvent,
  type NormalizedEvent,
} from "@/modules/events/utils/normalizer";

export const HeroSection = () => {
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Slides de publicidad
  const adSlides = [
    {
      id: "beneficios",
      title: "Beneficios osmi",
      description:
        "Registrate y obten acceso a preventas exclusivas, descuentos especiales, experiencias VIP y soporte prioritario.",
      link: "/register",
      linkText: "Registrarme ahora",
      color: "from-secondary/40 via-primary/20",
      badge: "EXCLUSIVO",
    },
    {
      id: "organizadores",
      title: "Para Organizadores",
      description:
        "Publica tus eventos con nosotros. Dashboard en tiempo real, pagos seguros y mayor alcance.",
      link: "/organizadores",
      linkText: "Saber mas",
      color: "from-primary/40 via-secondary/20",
      badge: "ORGANIZADORES",
    },
    {
      id: "tienda",
      title: "Tienda Fisica osmi",
      description:
        "Recoge premios, merchandise exclusivo y conoce nuestra tienda oficial.",
      link: "/tienda",
      linkText: "Como llegar",
      color: "from-orange-500/30 via-primary/20",
      badge: "TIENDA",
    },
  ];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await api.get<any>("/v1/events");

        const rawEvents = Array.isArray(data)
          ? data
          : data?.events || [];

        const normalized = rawEvents.map(normalizeEvent);

        setEvents(normalized);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Combinar eventos + publicidad
  const allSlides = [
    ...adSlides.map((ad) => ({
      type: "ad" as const,
      ...ad,
    })),
    ...events.map((event) => ({
      type: "event" as const,
      event,
    })),
  ];

  // Auto rotacion SOLO del hero
  useEffect(() => {
    if (allSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allSlides.length]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allSlides.length);
  }, [allSlides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + allSlides.length) % allSlides.length
    );
  }, [allSlides.length]);

  if (loading) {
    return (
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 pt-8 pb-4">
        <div className="rounded-[40px] border border-white/[0.06] min-h-[520px] lg:min-h-[600px] bg-white/[0.02] animate-pulse" />
      </section>
    );
  }

  if (allSlides.length === 0) return null;

  const slide = allSlides[currentIndex];

  // DESTACADO FIJO
  const featuredEvent =
    events.find((e) => e.image_url && e.min_price > 0) ||
    events[0] ||
    null;

  const formattedDate = featuredEvent
    ? new Date(featuredEvent.start_date).toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-8 pt-8 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[40px] border border-white/[0.06] min-h-[520px] lg:min-h-[600px] flex items-end group">

          {/* Fondo */}
          <div className="absolute inset-0 transition-opacity duration-700">
            {slide.type === "event" &&
            slide.event?.image_url ? (
              <Image
                src={slide.event.image_url}
                alt={slide.event.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  slide.type === "ad"
                    ? slide.color
                    : "from-secondary/40 via-primary/20"
                } to-background`}
              />
            )}
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Flechas */}
          {allSlides.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Dots */}
          {allSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {allSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-primary w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Contenido */}
          <div className="relative z-10 p-10 lg:p-16 w-full max-w-2xl">

            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.15em] mb-6">
              {slide.type === "ad"
                ? slide.badge
                : slide.event?.min_price > 0
                ? "Boletos disponibles"
                : "Proximamente"}
            </span>

            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight mb-4">
              {slide.type === "ad"
                ? slide.title
                : slide.event?.name}
            </h1>

            <p className="text-base text-muted max-w-xl leading-relaxed mb-8 line-clamp-2">
              {slide.type === "ad"
                ? slide.description
                : slide.event?.description}
            </p>

            {slide.type === "event" && (
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted mb-8">
                <div className="flex items-center gap-2">
                  <Calendar
                    size={16}
                    className="text-secondary"
                  />
                  <span>
                    {new Date(
                      slide.event.start_date
                    ).toLocaleDateString("es-MX", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>

                {slide.event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-secondary"
                    />
                    <span>{slide.event.location}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4">

              <Link
                href={
                  slide.type === "ad"
                    ? slide.link
                    : `/events/${slide.event?.public_id}`
                }
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                {slide.type === "ad"
                  ? slide.linkText
                  : "Ver evento"}

                <ArrowRight size={18} />
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm font-semibold text-foreground hover:bg-white/[0.08] transition-all"
              >
                Explorar mas
              </Link>

            </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        {featuredEvent && (
          <div className="flex flex-col gap-6">

            {/* DESTACADO FIJO */}
            <div className="glass-card overflow-hidden relative flex-1 min-h-[280px]">

              {featuredEvent.image_url && (
                <div className="absolute inset-0">
                  <Image
                    src={featuredEvent.image_url}
                    alt={featuredEvent.name}
                    fill
                    className="object-cover opacity-30"
                    sizes="380px"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] to-secondary/[0.06]" />

              <div className="relative z-10 p-8 h-full flex flex-col justify-between">

                <div>
                  <span className="badge badge-hot text-xs">
                    DESTACADO
                  </span>

                  <h3 className="text-xl font-black mt-4">
                    {featuredEvent.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-muted">

                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className="text-secondary"
                      />
                      <span>{formattedDate}</span>
                    </div>

                    {featuredEvent.location && (
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={14}
                          className="text-secondary"
                        />
                        <span>
                          {featuredEvent.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">

                  <div>
                    <p className="text-xs text-muted-dark">
                      Desde
                    </p>

                    <p className="text-2xl font-black text-primary">
                      $
                      {featuredEvent.min_price.toLocaleString(
                        "es-MX"
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/events/${featuredEvent.public_id}`}
                    className="px-6 py-3 rounded-full bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </div>

            {/* NOTICIAS */}
            <div className="glass-card p-8 relative overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.06] to-primary/[0.04]" />

              <div className="relative z-10">

                <h3 className="text-lg font-black">
                  Noticias osmi
                </h3>

                <div className="mt-4 space-y-3">
                  {events.slice(0, 3).map((e, i) => (
                    <Link
                      key={e.public_id}
                      href={`/events/${e.public_id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {i + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                          {e.name}
                        </p>

                        <p className="text-xs text-muted-dark truncate">
                          {new Date(
                            e.start_date
                          ).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/events"
                  className="block w-full text-center mt-6 py-3 rounded-full bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Ver todos los eventos
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};