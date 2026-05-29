"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { useCartStore } from "@/store/cart";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Limpiar carrito y datos temporales
    clearCart();
    sessionStorage.removeItem("osmi_order_id");
    sessionStorage.removeItem("osmi_client_secret");
  }, [clearCart]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-12 space-y-6">
          <CheckCircle size={64} className="mx-auto text-success" />
          <h1 className="text-3xl font-bold">Compra exitosa</h1>
          <p className="text-muted">
            Tus boletos han sido enviados a tu correo. Recibiras una confirmacion en breve.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => router.push("/events")}
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/20 transition-all"
            >
              Explorar mas eventos
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              Ver mis boletos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}