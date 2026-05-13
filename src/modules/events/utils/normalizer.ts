// src/modules/events/utils/normalizer.ts

export interface RawEvent {
  id?: string;
  publicId?: string;
  public_id?: string;

  name?: string;
  description?: string;

  location?: string;

  startDate?: string;
  start_date?: string;

  imageUrl?: string;
  image_url?: string;

  // NUEVOS CAMPOS
  coverImageUrl?: string;
  cover_image_url?: string;

  minPrice?: number;
  min_price?: number;
}

export interface NormalizedEvent {
  public_id: string;
  name: string;
  description: string;
  location: string;
  start_date: string;
  image_url: string;
  min_price: number;
}

export function normalizeEvent(event: RawEvent): NormalizedEvent {
  return {
    public_id:
      event.public_id ||
      event.publicId ||
      event.id ||
      "",

    name:
      event.name ||
      "Evento sin nombre",

    description:
      event.description ||
      "",

    location:
      event.location ||
      "Próximamente",

    start_date:
      event.start_date ||
      event.startDate ||
      new Date().toISOString(),

    // ACTUALIZADO PARA cover_image_url
    image_url:
      event.imageUrl ||
      event.image_url ||
      event.coverImageUrl ||
      event.cover_image_url ||
      "",

    min_price:
      event.min_price ||
      event.minPrice ||
      0,
  };
}