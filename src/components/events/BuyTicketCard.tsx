"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  ShoppingCart,
  Ticket,
} from "lucide-react";

import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

interface TicketType {
  id: string;
  name: string;
  basePrice: number;
  currency: string;
  availableQuantity: number;
  maxPerOrder: number;
}

interface BuyTicketCardProps {
  eventId: string;
  eventName: string;
  formattedDate: string;
  formattedTime: string;
  location: string;
}

export default function BuyTicketCard({
  eventId,
  eventName,
  formattedDate,
  formattedTime,
  location,
}: BuyTicketCardProps) {
  const router = useRouter();

  const {
    tickets,
    addTicket,
    removeTicket,
    updateQuantity,
    getTotal,
    getTicketCount,
  } = useCartStore();

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchTicketTypes() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket-types?event_id=${eventId}`
        );

        if (!res.ok)
          throw new Error(
            "No se pudieron cargar boletos"
          );

        const data = await res.json();

        if (mounted) {
          setTicketTypes(data.ticketTypes || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoadingTypes(false);
        }
      }
    }

    fetchTicketTypes();

    return () => {
      mounted = false;
    };
  }, [eventId]);

  const eventTickets = tickets.filter(
    (t) =>
      t.eventId === eventId &&
      t.quantity > 0
  );

  const total = eventTickets.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );

  const ticketCount = eventTickets.reduce(
    (sum, t) => sum + t.quantity,
    0
  );

  const handleAdd = (type: TicketType) => {
    addTicket({
      eventId,
      eventName,
      ticketTypeId: type.id,
      ticketTypeName: type.name,
      section: type.name,
      price: type.basePrice,
      quantity: 1,
      maxPerOrder: type.maxPerOrder,
      availableQuantity:
        type.availableQuantity,
    });
  };

  const handleQuantity = (
    type: TicketType,
    delta: number
  ) => {
    const existing =
      eventTickets.find(
        (t) =>
          t.ticketTypeId === type.id
      );

    if (!existing) return;

    const newQty =
      existing.quantity + delta;

    if (newQty <= 0) {
      removeTicket(type.id);
      return;
    }

    updateQuantity(
      type.id,
      newQty
    );
  };

  const handleCheckout = async () => {
    if (eventTickets.length === 0)
      return;

    setCheckoutLoading(true);

    try {
      const validation =
        useCartStore
          .getState()
          .validateStock();

      if (!validation.valid) {
        alert(
          validation.errors.join("\n")
        );
        return;
      }

      router.push("/checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loadingTypes) {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="h-5 bg-white/5 rounded animate-pulse" />
        <div className="h-16 bg-white/5 rounded animate-pulse" />
        <div className="h-16 bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  if (!ticketTypes.length) {
    return (
      <div className="glass-card p-6 text-center">
        <Ticket
          className="mx-auto mb-3 opacity-40"
          size={30}
        />
        <p className="text-sm text-muted">
          No hay boletos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6 glow-primary">

      <h3 className="text-xl font-bold">
        Comprar boletos
      </h3>

      {/* Evento */}
      <div className="space-y-1 text-sm text-muted">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
        <p>{location}</p>
      </div>

      {/* Ticket types */}
      <div className="space-y-4">

        {ticketTypes.map((type) => {
          const selected =
            eventTickets.find(
              (t) =>
                t.ticketTypeId ===
                type.id
            );

          const qty =
            selected?.quantity || 0;

          const max =
            Math.min(
              type.maxPerOrder,
              type.availableQuantity
            );

          return (
            <div
              key={type.id}
              className="rounded-2xl border border-white/10 p-4 space-y-3 hover:border-white/20 transition-all"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="font-semibold">
                    {type.name}
                  </p>

                  <p className="text-primary font-bold text-lg">
                    $
                    {type.basePrice.toLocaleString(
                      "es-MX"
                    )}
                  </p>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() =>
                      handleAdd(type)
                    }
                    disabled={
                      type.availableQuantity ===
                      0
                    }
                    className="rounded-full bg-primary/20 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/30 disabled:opacity-30"
                  >
                    {type.availableQuantity ===
                    0
                      ? "Agotado"
                      : "Agregar"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        handleQuantity(
                          type,
                          -1
                        )
                      }
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-6 text-center font-bold">
                      {qty}
                    </span>

                    <button
                      disabled={
                        qty >= max
                      }
                      onClick={() =>
                        handleQuantity(
                          type,
                          1
                        )
                      }
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xs text-muted-dark">
                <span>
                  {
                    type.availableQuantity
                  }{" "}
                  disponibles
                </span>

                <span>
                  Máx {type.maxPerOrder}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      {eventTickets.length > 0 && (
        <div className="border-t border-white/10 pt-5 space-y-4">

          <div className="flex justify-between text-sm">
            <span>
              Boletos
            </span>
            <span className="font-semibold">
              {ticketCount}
            </span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">
              $
              {total.toLocaleString(
                "es-MX"
              )}
            </span>
          </div>

          <button
            onClick={
              handleCheckout
            }
            disabled={
              checkoutLoading
            }
            className="w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <ShoppingCart
              size={18}
            />

            {checkoutLoading
              ? "Validando..."
              : "Proceder al pago"}
          </button>
        </div>
      )}

      <p className="text-xs text-center text-muted-dark">
        Pago seguro con Stripe •
        Confirmación inmediata
      </p>
    </div>
  );
}