"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  eventId: string;
}

export default function BuyButton({ eventId }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(`/checkout?event_id=${eventId}&quantity=${quantity}`);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg h-fit">
      <h3 className="text-lg font-semibold mb-4">¿Cuántos boletos?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
          <option key={q} value={q}>
            {q} {q === 1 ? "boleto" : "boletos"}
          </option>
        ))}
      </select>
      <button
        onClick={handleBuy}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Comprar boletos
      </button>
      <p className="text-sm text-gray-500 mt-3 text-center">
        Necesitas iniciar sesión para comprar
      </p>
    </div>
  );
}