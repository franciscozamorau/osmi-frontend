"use client";

import { useEffect, useMemo, useState } from "react";
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
import { AlertCircle, Lock, Loader2, Mail, ArrowRight } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
const API = process.env.NEXT_PUBLIC_API_URL!;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// --------------------------------------------------
// CUSTOMER (busca antes de crear para evitar duplicados)
// --------------------------------------------------
async function resolveCustomerId(customerEmail: string) {
  if (!customerEmail || !customerEmail.trim()) {
    throw new Error("Customer email is required");
  }
  const cleanEmail = customerEmail.trim().toLowerCase();
  const token = getCookie("token");

  // USUARIO LOGUEADO
  if (token) {
    try {
      const userRes = await fetch(`${API}/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      let userId = null;
      if (userRes.ok) {
        const userData = await userRes.json();
        userId = userData.user_id || userData.id;
      }
      if (!userId) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.user_id;
        } catch (e) { /* ignorar */ }
      }
      if (userId) {
        const customerRes = await fetch(`${API}/v1/customers?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (customerRes.ok) {
          const data = await customerRes.json();
          const customers = data.customers || [];
          if (customers.length > 0) {
            return customers[0].publicId || customers[0].public_id || String(customers[0].id);
          }
        }
        const createRes = await fetch(`${API}/v1/customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: "Usuario Osmi", email: cleanEmail, customer_type: "registered", user_id: userId }),
        });
        if (createRes.ok) {
          const customer = await createRes.json();
          return customer.publicId || customer.public_id || String(customer.id);
        }
      }
    } catch (err) { console.error("Error resolviendo customer:", err); }
  }

  // INVITADO: buscar primero por email, crear solo si no existe
  try {
    const searchRes = await fetch(`${API}/v1/customers?email=${encodeURIComponent(cleanEmail)}`);
    if (searchRes.ok) {
      const data = await searchRes.json();
      const customers = data.customers || [];
      if (customers.length > 0) {
        return customers[0].publicId || customers[0].public_id || String(customers[0].id);
      }
    }

    const guestRes = await fetch(`${API}/v1/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Invitado", email: cleanEmail, customer_type: "guest" }),
    });
    if (guestRes.ok) {
      const guest = await guestRes.json();
      return guest.publicId || guest.public_id || String(guest.id);
    }
  } catch (err) { console.error("Error con customer invitado:", err); }

  return null;
}

// --------------------------------------------------
// FASE 1: INFO STEP
// --------------------------------------------------
function CheckoutInfoStep({
  onContinue,
  isCreatingPayment,
  error,
}: {
  onContinue: (email: string) => void;
  isCreatingPayment: boolean;
  error: string | null;
}) {
  const { tickets } = useCartStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("osmi_checkout_email") || "";
    setEmail(saved);
  }, []);

  const total = tickets.reduce((sum, t) => sum + t.price * t.quantity, 0);

  const grouped = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      if (!acc[ticket.eventName]) acc[ticket.eventName] = [];
      acc[ticket.eventName].push(ticket);
      return acc;
    }, {} as Record<string, typeof tickets>);
  }, [tickets]);

  function validateEmail(e: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function handleContinue() {
    if (!email.trim()) {
      setEmailError("Ingresa tu correo para recibir el boleto");
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError("Ingresa un correo valido");
      return;
    }
    setEmailError("");
    localStorage.setItem("osmi_checkout_email", email.trim().toLowerCase());
    onContinue(email.trim().toLowerCase());
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted mb-8">Compra segura protegida por Stripe</p>

      <div className="glass-card p-6 mb-6 space-y-4">
        <h3 className="font-semibold text-foreground">Donde recibiras tu boleto?</h3>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
            placeholder="tu@correo.com"
            className={`w-full h-12 rounded-2xl border pl-11 pr-4 text-sm text-foreground placeholder:text-muted-dark outline-none transition-all bg-white/[0.03] ${
              emailError ? "border-danger/50 focus:border-danger" : "border-white/[0.08] focus:border-primary/30 focus:bg-white/[0.05]"
            }`}
            required
          />
        </div>
        {emailError && (
          <p className="text-danger text-xs flex items-center gap-1">
            <AlertCircle size={12} /> {emailError}
          </p>
        )}
        <p className="text-xs text-muted-dark">Enviaremos tu boleto con codigo QR a este correo.</p>
      </div>

      <div className="glass-card p-6 mb-6 space-y-6">
        {Object.entries(grouped).map(([event, items]) => (
          <div key={event}>
            <h2 className="font-bold mb-4">{event}</h2>
            {items.map((ticket) => (
              <div key={ticket.ticketTypeId} className="flex justify-between py-2">
                <span>{ticket.ticketTypeName} x {ticket.quantity}</span>
                <span>${(ticket.price * ticket.quantity).toLocaleString("es-MX")}</span>
              </div>
            ))}
          </div>
        ))}
        <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${total.toLocaleString("es-MX")}</span>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 mb-6 text-sm flex gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <button
        disabled={isCreatingPayment}
        onClick={handleContinue}
        className="w-full rounded-full bg-primary px-6 py-4 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isCreatingPayment ? (
          <><Loader2 className="animate-spin" size={18} /> Preparando pago...</>
        ) : (
          <><ArrowRight size={18} /> Continuar al pago</>
        )}
      </button>
    </main>
  );
}

// --------------------------------------------------
// FASE 2: PAYMENT STEP
// --------------------------------------------------
function PaymentStep({ clientSecret, onBack }: { clientSecret: string; onBack: () => void }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
      <PaymentForm onBack={onBack} />
    </Elements>
  );
}

function PaymentForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { tickets, validateStock } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const total = tickets.reduce((sum, t) => sum + t.price * t.quantity, 0);

  async function pay() {
    if (!stripe || !elements) return;
    const validation = validateStock();
    if (!validation.valid) {
      setError(validation.errors.join("\n"));
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

    if (result.error) {
      setError(result.error.message || "Pago fallido");
      setProcessing(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Pago seguro</h1>
      <p className="text-muted mb-8">Tus datos estan protegidos por Stripe</p>

      <div className="glass-card p-6 mb-6">
        <PaymentElement />
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-dark">
          <Lock size={12} /> Pago seguro cifrado
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 mb-6 text-sm flex gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-4 text-sm font-bold">
          Volver
        </button>
        <button
          disabled={processing}
          onClick={pay}
          className="btn-primary flex-1 py-4 text-sm font-bold disabled:opacity-50"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> Procesando...</>
          ) : (
            <><Lock size={16} /> Pagar ${total.toLocaleString("es-MX")}</>
          )}
        </button>
      </div>
    </main>
  );
}

// --------------------------------------------------
// PAGE
// --------------------------------------------------
export default function CheckoutPage() {
  const { tickets } = useCartStore();
  const [step, setStep] = useState<"info" | "payment">("info");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Recuperar estado al refrescar
  useEffect(() => {
    const savedSecret = sessionStorage.getItem("osmi_client_secret");
    const savedOrderId = sessionStorage.getItem("osmi_order_id");
    if (savedSecret && savedOrderId) {
      setClientSecret(savedSecret);
      setOrderId(savedOrderId);
      setStep("payment");
    }
  }, []);

  useEffect(() => {
    if (!tickets.length) {
      router.push("/events");
    }
  }, [tickets, router]);

  const handleContinue = async (email: string) => {
    setIsCreatingPayment(true);
    setError(null);

    try {
      const customerId = await resolveCustomerId(email);
      if (!customerId) {
        setError("No se pudo crear el comprador. Intenta de nuevo.");
        setIsCreatingPayment(false);
        return;
      }

      const order = await api.post("/v1/orders", {
        customer_id: customerId,
        items: tickets.map((t) => ({
          ticket_type_id: t.ticketTypeId,
          quantity: t.quantity,
        })),
        customer_email: email,
        customer_name: "Invitado",
      });

      const newOrderId = order.public_id || order.publicId || order.id;

      const payment = await api.post("/v1/payments/intent", {
        order_id: newOrderId,
        currency: "MXN",
      });

      const secret = payment.client_secret || payment.clientSecret;
      if (!secret) {
        setError("Error al crear el pago. Intenta de nuevo.");
        setIsCreatingPayment(false);
        return;
      }

      sessionStorage.setItem("osmi_order_id", newOrderId);
      sessionStorage.setItem("osmi_client_secret", secret);

      setOrderId(newOrderId);
      setClientSecret(secret);
      setStep("payment");
    } catch (err: any) {
      setError(err.message || "Error al crear el pago");
    } finally {
      setIsCreatingPayment(false);
    }
  };

  if (!tickets.length) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Carrito vacio</h1>
          <button onClick={() => router.push("/events")} className="btn-primary">Explorar eventos</button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {step === "info" && (
        <CheckoutInfoStep onContinue={handleContinue} isCreatingPayment={isCreatingPayment} error={error} />
      )}
      {step === "payment" && clientSecret && (
        <PaymentStep clientSecret={clientSecret} onBack={() => setStep("info")} />
      )}
    </div>
  );
}