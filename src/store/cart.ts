// src/store/cart.ts

import { create } from "zustand";

export interface CartTicket {
  eventId: string;
  eventName: string;

  ticketTypeId: string;
  ticketTypeName: string;
  section: string;

  price: number;
  quantity: number;

  maxPerOrder: number;
  availableQuantity: number;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface CartState {
  tickets: CartTicket[];

  addTicket: (ticket: CartTicket) => void;

  removeTicket: (ticketTypeId: string) => void;

  updateQuantity: (
    ticketTypeId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  getTotal: () => number;

  getTicketCount: () => number;

  validateStock: () => ValidationResult;
}

export const useCartStore = create<CartState>((set, get) => ({
  tickets: [],

  addTicket: (ticket) =>
    set((state) => {
      const existing = state.tickets.find(
        (t) =>
          t.ticketTypeId === ticket.ticketTypeId &&
          t.eventId === ticket.eventId
      );

      if (existing) {
        return {
          tickets: state.tickets.map((t) =>
            t.ticketTypeId === ticket.ticketTypeId &&
            t.eventId === ticket.eventId
              ? {
                  ...t,
                  quantity: Math.min(
                    t.quantity + ticket.quantity,
                    t.maxPerOrder,
                    t.availableQuantity
                  ),
                }
              : t
          ),
        };
      }

      return {
        tickets: [
          ...state.tickets,
          {
            ...ticket,
            quantity: Math.min(
              ticket.quantity,
              ticket.maxPerOrder,
              ticket.availableQuantity
            ),
          },
        ],
      };
    }),

  removeTicket: (ticketTypeId) =>
    set((state) => ({
      tickets: state.tickets.filter(
        (t) => t.ticketTypeId !== ticketTypeId
      ),
    })),

  updateQuantity: (ticketTypeId, quantity) =>
    set((state) => ({
      tickets:
        quantity <= 0
          ? state.tickets.filter(
              (t) => t.ticketTypeId !== ticketTypeId
            )
          : state.tickets.map((t) =>
              t.ticketTypeId === ticketTypeId
                ? {
                    ...t,
                    quantity: Math.min(
                      quantity,
                      t.maxPerOrder,
                      t.availableQuantity
                    ),
                  }
                : t
            ),
    })),

  clearCart: () =>
    set({
      tickets: [],
    }),

  getTotal: () =>
    get().tickets.reduce(
      (sum, ticket) =>
        sum + ticket.price * ticket.quantity,
      0
    ),

  getTicketCount: () =>
    get().tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    ),

  validateStock: (): ValidationResult => {
    const tickets = get().tickets;
    const errors: string[] = [];

    if (tickets.length === 0) {
      errors.push(
        "No hay boletos seleccionados."
      );
    }

    for (const ticket of tickets) {
      if (ticket.quantity <= 0) {
        errors.push(
          `${ticket.ticketTypeName}: cantidad inválida`
        );
      }

      if (
        ticket.quantity >
        ticket.availableQuantity
      ) {
        errors.push(
          `${ticket.ticketTypeName}: solo quedan ${ticket.availableQuantity} disponibles`
        );
      }

      if (
        ticket.quantity >
        ticket.maxPerOrder
      ) {
        errors.push(
          `${ticket.ticketTypeName}: máximo ${ticket.maxPerOrder} por compra`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
}));