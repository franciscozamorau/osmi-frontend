import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import type { NormalizedEvent } from "@/modules/events/utils/normalizer";

interface EventCardProps {
  event: NormalizedEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = new Date(event.start_date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(event.start_date).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isNew = new Date(event.start_date) > new Date();
  const isSoon = new Date(event.start_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/events/${event.public_id}`} className="group block fade-in">
      <div className="glass-card overflow-hidden transition-all duration-300 group-hover:glow-primary group-hover:-translate-y-1">
        {/* Imagen */}
        <div className="relative w-full h-52 overflow-hidden">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-gradient opacity-30">osmi</span>
            </div>
          )}

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && <span className="badge badge-new">Nuevo</span>}
            {isSoon && <span className="badge badge-soon">Próximamente</span>}
          </div>

          {/* Precio */}
          {event.min_price > 0 && (
            <span className="absolute top-3 right-3 bg-background/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/30">
              Desde ${event.min_price.toLocaleString("es-MX")}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {event.name}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted text-sm">
              <Calendar size={14} className="text-secondary flex-shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm">
              <Clock size={14} className="text-secondary flex-shrink-0" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm">
              <MapPin size={14} className="text-secondary flex-shrink-0" />
              <span className="truncate">{event.location || "Por anunciar"}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end">
            <span className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors">
              Ver evento →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};