// src/components/navigation/Navbar.tsx
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-2xl font-bold text-gradient">
            osmi
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          <Link href="/events" className="text-sm font-semibold text-muted hover:text-foreground transition-colors">
            Explorar
          </Link>
          <Link href="#" className="text-sm font-semibold text-muted hover:text-foreground transition-colors">
            Categorías
          </Link>
          <Link href="#" className="text-sm font-semibold text-muted hover:text-foreground transition-colors">
            Para Organizadores
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <Link href="/login" className="text-sm font-semibold text-muted hover:text-foreground transition-colors">
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-white/20 transition-all"
          >
            Registrarse
          </Link>
        </div>
        {/* Botón de menú móvil aquí, más adelante */}
      </nav>
    </header>
  );
};