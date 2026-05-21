"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Ticket, LogOut, Menu, X, Search } from "lucide-react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCookie("token"));
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex items-center h-16 px-6 lg:px-8 max-w-[1400px] gap-6">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gradient shrink-0">
          osmi
        </Link>

        {/* Search - desktop */}
        <div className="hidden lg:flex flex-1 max-w-[420px] relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar eventos, artistas, lugares..."
            className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.03] pl-11 pr-4 text-sm text-foreground placeholder:text-muted-dark outline-none transition-all focus:border-primary/30 focus:bg-white/[0.05]"
          />
        </div>

        {/* Spacer */}
        <div className="hidden lg:block flex-1" />

        {/* Navegacion */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/events" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/events") ? "bg-white/[0.06] text-foreground" : "text-muted hover:text-foreground hover:bg-white/[0.03]"}`}>Explorar</Link>
          <Link href="/events" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/categorias" ? "bg-white/[0.06] text-foreground" : "text-muted hover:text-foreground hover:bg-white/[0.03]"}`}>Categorias</Link>
          <Link href="#" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/organizadores" ? "bg-white/[0.06] text-foreground" : "text-muted hover:text-foreground hover:bg-white/[0.03]"}`}>Para Organizadores</Link>
        </nav>

        {/* Auth */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/[0.03] transition-colors">
                <Ticket size={15} />
                Mis boletos
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/[0.03] transition-colors">
                <LogOut size={15} />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/[0.03] transition-colors">
                Iniciar Sesion
              </Link>
              <Link href="/register" className="px-5 py-2.5 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground p-2 ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-background/95 backdrop-blur-2xl px-6 py-5 space-y-3 fade-in">
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" />
            <input type="text" placeholder="Buscar eventos..." className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.03] pl-11 pr-4 text-sm text-foreground placeholder:text-muted-dark outline-none" />
          </div>
          <Link href="/events" className="block py-2 text-sm font-medium text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>Explorar</Link>
          <Link href="/events" className="block py-2 text-sm font-medium text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>Categorias</Link>
          <Link href="#" className="block py-2 text-sm font-medium text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>Para Organizadores</Link>
          <hr className="border-white/[0.06]" />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Mis boletos</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-sm font-medium text-muted">Cerrar sesion</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm font-medium text-muted" onClick={() => setMobileOpen(false)}>Iniciar Sesion</Link>
              <Link href="/register" className="block w-full text-center py-2.5 rounded-xl bg-primary text-sm font-bold text-white mt-2" onClick={() => setMobileOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};