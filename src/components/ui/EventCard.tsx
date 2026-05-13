// src/components/ui/EventCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { NormalizedEvent } from "@/modules/events/utils/normalizer";
import {
  type NormalizedEvent as Event,
} from "@/modules/events/utils/normalizer";

interface EventCardProps {
  event: NormalizedEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = new Date(event.start_date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/events/${event.public_id}`} className="group block">
      <div className="glass-card overflow-hidden transition-all duration-300 group-hover:glow-primary group-hover:-translate-y-1">
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
              <span className="text-4xl font-bold text-gradient opacity-30">OSMI</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
            {event.name}
          </h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted text-sm">
              <Calendar size={14} className="text-secondary flex-shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm">
              <MapPin size={14} className="text-secondary flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <span className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors">
              Ver evento →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
