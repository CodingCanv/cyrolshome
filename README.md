# Gestionale Casa

PWA condivisa tra due utenti per gestire lavori e spese nella nuova casa.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **PWA**: vite-plugin-pwa (manifest, service worker, “Aggiungi a Home”)
- **Backend**: Supabase (Auth email/password + PostgreSQL)
- **Deploy**: Vercel

## Setup

1. **Clona e dipendenze**
   ```bash
   cd gestionale_casa
   npm install
   ```

2. **Supabase**
   - Crea un progetto su [supabase.com](https://supabase.com).
   - In SQL Editor esegui lo script in `supabase/migrations/001_init.sql` (crea tabelle `spazi` e `compiti` + RLS).
   - In Authentication → Users crea i due utenti (email/password). Nessuna registrazione pubblica.
   - In Settings → API copia URL e anon key.

3. **Variabili d’ambiente**
   ```bash
   cp .env.example .env
   ```
   Compila `.env` con:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (Opzionale) `VITE_USER_1_ID`, `VITE_USER_2_ID`, `VITE_USER_1_LABEL`, `VITE_USER_2_LABEL` per le select “Assegnato a” / “Eseguito da” (UUID degli utenti Auth).

4. **Icone PWA** (per “Aggiungi a Home” su iPhone)
   - Aggiungi in `public/icons/` i file `icon-192.png` (192×192) e `icon-512.png` (512×512). Vedi `public/icons/README.txt`.

## Scripts

- `npm run dev` – avvio in sviluppo
- `npm run build` – build per produzione
- `npm run preview` – anteprima della build

## Deploy su Vercel

- Collega il repo a Vercel. Build: `npm run build`, output: `dist`.
- Imposta le stesse variabili d’ambiente nel progetto Vercel.
- Su iPhone: apri l’URL Vercel in Safari → Condividi → “Aggiungi a Home”.

## Documentazione

| File | Contenuto |
|------|-----------|
| **docs/STRUTTURA_PROGETTO.md** | Obiettivo, stack, struttura cartelle |
| **docs/ARCHITETTURA_E_DATI.md** | Spazi, schema compiti, RLS, report |
| **docs/PROMPT_IMPLEMENTAZIONE.md** | Prompt usato per l’implementazione |
