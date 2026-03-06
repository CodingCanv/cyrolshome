# Gestionale Casa – Struttura progetto

## Obiettivo

PWA/Web App condivisa tra due utenti (io e la compagna) per:
- Segnare lavori da eseguire / già eseguiti nella nuova casa
- Dashboard con calendario (cose da fare vs fatte)
- Report spese: totale, dettaglio per voce, spesa pro capite

Solo 2 account fissi, nessuna registrazione pubblica. Installabile su iPhone dalla home (Add to Home Screen).

---

## Stack consigliato (tutto gratuito)

| Componente | Scelta | Motivo |
|------------|--------|--------|
| **Frontend** | React (Vite) o Next.js | Vite: più veloce per PWA semplice; Next.js: se vuoi SSR/API route nello stesso repo |
| **PWA** | Workbox / vite-plugin-pWA | Manifest + service worker per “Aggiungi a Home” e uso offline base |
| **Hosting frontend** | **Vercel** | Deploy da Git, dominio *.vercel.app gratuito, HTTPS automatico |
| **Backend / DB** | **Supabase** | PostgreSQL, Auth (max 2 utenti), Row Level Security, API REST e Realtime gratuiti |
| **Dominio** | `*.vercel.app` (o sottodominio Supabase se serve) | Nessun dominio a pagamento |

Alternativa backend: **Firebase** (Firestore + Auth) se preferisci NoSQL; Supabase è più adatto a report/aggregazioni SQL e costi pro capite.

---

## Struttura cartelle (suggerita)

```
gestionale_casa/
├── docs/                          # Documentazione (questa cartella)
│   ├── STRUTTURA_PROGETTO.md
│   ├── ARCHITETTURA_E_DATI.md
│   └── PROMPT_IMPLEMENTAZIONE.md
├── src/                           # Oppure /app se Next.js
│   ├── components/
│   │   ├── layout/                # Header, menu, layout PWA
│   │   ├── spazi/                 # Lista spazi, compiti per spazio
│   │   ├── calendario/            # Vista Gantt/calendario
│   │   └── report/                # Report spese e pro capite
│   ├── pages/ o app/              # Route: /spazi, /calendario, /report
│   ├── hooks/                     # useSpazi, useCompiti, useReport
│   ├── lib/                       # client Supabase, helpers
│   └── types/                     # Tipi TypeScript
├── public/
│   ├── manifest.json              # PWA manifest
│   └── icons/                     # Icone 192, 512 per home screen
├── package.json
├── vite.config.ts (o next.config.js)
└── .env.example                   # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

---

## Esecuzione veloce e funzionale

1. **Supabase**: creare progetto → tabella `spazi` (fissa), `compiti`, `utenti` (o usare Auth users). Abilitare Auth con Email (inviti solo per voi due).
2. **Vercel**: connettere repo GitHub del frontend → deploy automatico su ogni push. URL tipo `gestionale-casa-xxx.vercel.app`.
3. **PWA**: manifest con `display: standalone`, icone 192/512; service worker per cache asset. Su iPhone: Safari → Condividi → “Aggiungi a Home”.
4. **Sviluppo**: prima solo frontend + mock dati; poi integrare Supabase (auth + CRUD compiti + query report). Calendario/Gantt con libreria leggera (es. FullCalendar o timeline custom).

---

## Domini e costi

- **Frontend**: Vercel offre `nome-progetto.vercel.app` gratis e HTTPS.
- **Supabase**: hostato da loro, si accede via API; non serve un dominio proprio.
- Nessun dominio a pagamento necessario: si usa il link Vercel sulla home del telefono.

---

## Prossimi passi (dopo questo documento)

1. Definire nel dettaglio modello dati e flussi (vedi `ARCHITETTURA_E_DATI.md`).
2. Usare `PROMPT_IMPLEMENTAZIONE.md` nella chat per generare il codice in un secondo momento.
