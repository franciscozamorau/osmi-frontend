"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

import { Navbar } from "@/components/navigation/Navbar";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";

import {
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY!
);

const API =
  process.env.NEXT_PUBLIC_API_URL!;

// --------------------------------------------------
// COOKIE
// --------------------------------------------------

function getCookie(name: string) {
  if (typeof document === "undefined")
    return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(
    `; ${name}=`
  );

  if (parts.length === 2) {
    return (
      parts
        .pop()
        ?.split(";")
        .shift() || null
    );
  }

  return null;
}

// --------------------------------------------------
// CUSTOMER
// --------------------------------------------------

async function resolveCustomerId() {
  const token = getCookie("token");

  if (token) {
    try {
      // PASO 1: Obtener el perfil del usuario autenticado
      const userRes = await fetch(`${API}/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let userId = null;
      if (userRes.ok) {
        const userData = await userRes.json();
        userId = userData.user_id || userData.id;
      }

      // Si no existe /v1/auth/me, decodificar el JWT para obtener user_id
      if (!userId) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.user_id;
        } catch (e) {
          console.error("Error decodificando JWT:", e);
        }
      }

      if (userId) {
        // PASO 2: Buscar customer existente por user_id
        const customerRes = await fetch(
          `${API}/v1/customers?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (customerRes.ok) {
          const data = await customerRes.json();
          const customers = data.customers || [];
          
          // Devolver el primer customer activo
          if (customers.length > 0) {
            return customers[0].publicId || customers[0].public_id || String(customers[0].id);
          }
        }

        // PASO 3: Si no existe, crear customer vinculado al user_id
        const createRes = await fetch(`${API}/v1/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: "Usuario Osmi",
            email: `user_${userId}@osmi.app`,
            customer_type: "registered",
            user_id: userId,
          }),
        });

        if (createRes.ok) {
          const customer = await createRes.json();
          return customer.publicId || customer.public_id || String(customer.id);
        }
      }
    } catch (err) {
      console.error("Error resolviendo customer:", err);
    }
  }

  // Invitado: crear customer anónimo
  try {
    const guestRes = await fetch(`${API}/v1/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Invitado",
        email: `guest_${Date.now()}@osmi.app`,
        customer_type: "guest",
      }),
    });

    if (guestRes.ok) {
      const guest = await guestRes.json();
      return guest.publicId || guest.public_id || String(guest.id);
    }
  } catch (err) {
    console.error("Error creando customer invitado:", err);
  }

  return null;
}

// --------------------------------------------------
// CHECKOUT FORM
// --------------------------------------------------

function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const router =
    useRouter();

  const stripe =
    useStripe();

  const elements =
    useElements();

  const {
    tickets,
    clearCart,
    validateStock,
  } = useCartStore();

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const total =
    tickets.reduce(
      (sum, t) =>
        sum +
        t.price *
          t.quantity,
      0
    );

  const grouped =
    useMemo(() => {
      return tickets.reduce(
        (
          acc,
          ticket
        ) => {
          if (
            !acc[
              ticket
                .eventName
            ]
          ) {
            acc[
              ticket
                .eventName
            ] = [];
          }

          acc[
            ticket
              .eventName
          ].push(ticket);

          return acc;
        },
        {} as Record<
          string,
          typeof tickets
        >
      );
    }, [tickets]);

  async function pay() {
    if (
      !stripe ||
      !elements
    )
      return;

    const validation =
      validateStock();

    if (
      !validation.valid
    ) {
      setError(
        validation.errors.join(
          "\n"
        )
      );

      return;
    }

    setProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "always",
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (
      result.error
    ) {
      setError(
        result.error
          .message ||
 "Pago fallido"
      );

      setProcessing(false);

      return;
    }

    clearCart();

    router.push(
      "/success"
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold mb-2">
        Checkout
      </h1>

      <p className="text-muted mb-8">
        Compra segura
        protegida por
        Stripe
      </p>

      {/* ORDER */}
      <div className="glass-card p-6 mb-6 space-y-6">

        {Object.entries(
          grouped
        ).map(
          ([
            event,
            items,
          ]) => (
            <div
              key={event}
            >
              <h2 className="font-bold mb-4">
                {event}
              </h2>

              {items.map(
                (
                  ticket
                ) => (
                  <div
                    key={
                      ticket.ticketTypeId
                    }
                    className="flex justify-between py-2"
                  >
                    <span>
                      {
                        ticket.ticketTypeName
                      }{" "}
                      ×{" "}
                      {
                        ticket.quantity
                      }
                    </span>

                    <span>
                      $
                      {(
                        ticket.price *
                        ticket.quantity
                      ).toLocaleString(
                        "es-MX"
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          )
        )}

        <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
          <span>
            Total
          </span>

          <span className="text-primary">
            $
            {total.toLocaleString(
              "es-MX"
            )}
          </span>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="glass-card p-6 mb-6">
        <PaymentElement />

        <div className="flex items-center gap-2 mt-4 text-xs text-muted-dark">
          <Lock size={12} />
          Pago seguro
          cifrado
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 mb-6 text-sm flex gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        disabled={
          processing
        }
        onClick={pay}
        className="w-full rounded-full bg-primary px-6 py-4 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {processing ? (
          <>
            <Loader2
              className="animate-spin"
              size={18}
            />
            Procesando...
          </>
        ) : (
          <>
            <Lock size={16} />
            Pagar $
            {total.toLocaleString(
              "es-MX"
            )}
          </>
        )}
      </button>
    </main>
  );
}

// --------------------------------------------------
// PAGE
// --------------------------------------------------

export default function CheckoutPage() {
  const {
    tickets,
  } =
    useCartStore();

  const [
    clientSecret,
    setClientSecret,
  ] =
    useState<
      string | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const router =
    useRouter();

  // --------------------------------------------------
  // FIX DOBLE REQUEST
  // --------------------------------------------------

  const initialized =
    useRef(false);

  useEffect(() => {
    if (
      initialized.current
    )
      return;

    initialized.current =
      true;

    async function init() {
      if (
        !tickets.length
      ) {
        router.push(
          "/events"
        );

        return;
      }

      const customerId =
        await resolveCustomerId();

      if (!customerId) {
        setLoading(false);
        return;
      }

      // PASO 1:
      // Crear orden

      const order =
        await api.post(
          "/v1/orders",
          {
            customer_id:
              customerId,

            items:
              tickets.map(
                (
                  t
                ) => ({
                  ticket_type_id:
                    t.ticketTypeId,

                  quantity:
                    t.quantity,
                })
              ),
          }
        );

      const orderId =
        order.public_id ||
        order.publicId ||
        order.id;

      // PASO 2:
      // Crear PaymentIntent

      const payment =
        await api.post(
          "/v1/payments/intent",
          {
            order_id:
              orderId,

            currency:
              "MXN",
          }
        );

      setClientSecret(
        payment.client_secret ||
          payment.clientSecret
      );

      setLoading(false);
    }

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <Elements
        stripe={
          stripePromise
        }
        options={{
          clientSecret,

          appearance:
            {
              theme:
                "night",
            },
        }}
      >
        <CheckoutForm
          clientSecret={
            clientSecret
          }
        />
      </Elements>
    </div>
  );
}