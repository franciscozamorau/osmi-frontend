"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post<{ token: string }>("/v1/auth/login", {
        email,
        password,
      });
      document.cookie = `token=${res.token}; path=/; SameSite=Lax`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Credenciales invalidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] bg-primary pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] bg-secondary pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-gradient tracking-tight">
            osmi
          </Link>
          <p className="text-muted mt-3 text-sm">Bienvenido de vuelta</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-2xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Correo electronico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full h-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 text-sm text-foreground placeholder:text-muted-dark outline-none transition-all focus:border-primary/30 focus:bg-white/[0.05] focus:ring-1 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Contrasena
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  className="w-full h-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-12 text-sm text-foreground placeholder:text-muted-dark outline-none transition-all focus:border-primary/30 focus:bg-white/[0.05] focus:ring-1 focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-dark hover:text-muted transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar Sesion
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-dark">
              No tienes cuenta?{" "}
              <Link href="/register" className="text-secondary hover:text-primary transition-colors font-semibold">
                Registrate
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-muted-dark hover:text-muted transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};