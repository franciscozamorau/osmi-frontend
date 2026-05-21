import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-background-secondary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Marca */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link href="/" className="text-2xl font-bold text-gradient">
            osmi
          </Link>
          <p className="text-sm text-muted-dark leading-relaxed max-w-xs">
            La experiencia de boletos mas inteligente del planeta. Seguro, rapido y confiable.
          </p>
        </div>

        {/* Explorar */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Explorar</h4>
          <ul className="space-y-2.5">
            <li><Link href="/events" className="text-sm text-muted-dark hover:text-foreground transition-colors">Conciertos</Link></li>
            <li><Link href="/events" className="text-sm text-muted-dark hover:text-foreground transition-colors">Deportes</Link></li>
            <li><Link href="/events" className="text-sm text-muted-dark hover:text-foreground transition-colors">Teatro</Link></li>
            <li><Link href="/events" className="text-sm text-muted-dark hover:text-foreground transition-colors">Festivales</Link></li>
            <li><Link href="/events" className="text-sm text-muted-dark hover:text-foreground transition-colors">Experiencias</Link></li>
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">osmi</h4>
          <ul className="space-y-2.5">
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Sobre nosotros</Link></li>
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Para organizadores</Link></li>
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Contacto</Link></li>
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Prensa</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
          <ul className="space-y-2.5">
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Privacidad</Link></li>
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Terminos</Link></li>
            <li><Link href="#" className="text-sm text-muted-dark hover:text-foreground transition-colors">Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-dark">
          <p>2026 osmi. Todos los derechos reservados.</p>
          <p>
            Creado por <span className="text-gradient font-semibold">Desfragmentado el MC Legendario</span>
          </p>
        </div>
      </div>
    </footer>
  );
};