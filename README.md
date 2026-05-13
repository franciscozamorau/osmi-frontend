osmi-front/
├── .next/
├── node_modules/
├── public/
├── src/
│   ├── app/                         ← Rutas principales (Next.js App Router)
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx         ← Página de Login
│   │   ├── (dashboard)/
│   │   │   └── dashboard/           ← Página de Dashboard
│   │   ├── (public)/
│   │   │   └── events/
│   │   │       ├── [public_id]/
│   │   │       │   └── page.tsx     ← EventPage (detalle evento)
│   │   │       └── page.tsx         ← EventsPage (explorar todos los eventos)
│   │   │   └── page.tsx             ← Página pública principal
│   │   ├── checkout/                ← Página de Checkout
│   │   ├── success/                 ← Página de éxito post-compra
│   │   ├── favicon.ico              ← Ícono de la aplicación
│   │   ├── globals.css              ← Estilos globales
│   │   └── layout.tsx               ← Layout raíz de la app
│   │
│   ├── components/                  ← Componentes UI reutilizables
│   │   ├── checkout/                ← Componentes de flujo de pago
│   │   ├── dashboard/               ← Componentes del dashboard
│   │   ├── events/                  ← Componentes de eventos
│   │   │   ├── BuyTicketCard.tsx
│   │   │   ├── TicketSelector.tsx
│   │   │   └── EventHero.tsx
│   │   ├── home/                    
│   │   │   └── HeroSection.tsx      ← Hero principal de Home
│   │   ├── navigation/
│   │   │   └── Navbar.tsx           ← Barra de navegación
│   │   ├── ui/
│   │   │   └── EventCard.tsx        ← Card de evento
│   │   └── BuyButton.tsx            ← Botón de compra
│   │
│   ├── hooks/                       ← Custom hooks
│   │
│   ├── lib/                         ← Utilidades generales
│   │   ├── api.ts                   ← Cliente HTTP
│   │   └── stripe.ts                ← Configuración Stripe
│   │
│   ├── modules/                     ← Lógica por dominio
│   │   ├── auth/
│   │   │   ├── api/                 ← Endpoints de autenticación
│   │   │   ├── hooks/               ← Hooks de auth
│   │   │   ├── store/               ← Estado de auth
│   │   │   ├── types/               ← Tipos de auth
│   │   │   └── utils/               ← Utilidades de auth
│   │   ├── events/
│   │   │   ├── api.ts               ← API de eventos
│   │   │   ├── types.ts             ← Tipos de eventos
│   │   │   └── utils/
│   │   │       └── normalizer.ts    ← Normalizador de datos de eventos
│   │   ├── orders/                  ← Lógica de órdenes
│   │   ├── payments/
│   │   │   └── components/          ← Componentes de pagos
│   │   └── tickets/                 ← Lógica de tickets
│   │
│   ├── services/                    ← Servicios externos
│   │    
    ├── store/                       ← Estado global (Zustand)
    │   └── cart.ts    
    ├── styles/                      ← Estilos compartidos
    ├── providers/                   ← Providers de contexto
    ├── types/
    │   └── index.ts                 ← Tipos globales
    └── proxy.ts                     ← Proxy de API
├── .env.local
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json