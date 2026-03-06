# Prompt per l’implementazione – Gestionale Casa

Usa questo testo (anche incollandolo in una nuova chat) quando vuoi passare alla fase codice. I dettagli di struttura e dati sono in `docs/STRUTTURA_PROGETTO.md` e `docs/ARCHITETTURA_E_DATI.md` nella stessa repo.

---

## Contesto

Devo implementare un **gestionale casa** come **PWA** (React + Vite), con backend **Supabase** e deploy su **Vercel**. L’app è condivisa tra **solo 2 utenti** (io e la compagna), nessuna registrazione pubblica. Deve essere usabile da telefono e aggiungibile alla home (iPhone).

---

## Cosa implementare

### 1. Setup progetto

- Progetto **React + TypeScript** con **Vite**.
- Configurazione **PWA**: `vite-plugin-pwa`, `manifest.json` con `display: standalone`, icone 192x192 e 512x512 per “Aggiungi a Home”.
- Client **Supabase** (Auth + Database). Variabili d’ambiente: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (e `.env.example` senza valori sensibili).
- Routing: React Router con route `/`, `/spazi`, `/spazi/:spazioId`, `/calendario`, `/report`. Login su `/login` (o modale); se non autenticato, redirect a login.

### 2. Backend Supabase

- **Auth**: solo email/password. I due utenti vanno creati a mano (o con uno script una tantum); niente pagina “Registrati” pubblica.
- **Tabella `spazi`**: 9 righe fisse come in `ARCHITETTURA_E_DATI.md` (ingresso, cucina, soggiorno, terrazzo, bagno, cameretta, camera, balcone-piccolo, varie).
- **Tabella `compiti`**: campi come in `ARCHITETTURA_E_DATI.md` (id, spazio_id, titolo, data_inizio, data_fine, costo, eseguito, assegnato_a, eseguito_da, creato_da, creato_il, aggiornato_il). RLS: accesso in lettura/scrittura solo per utenti autenticati.
- (Opzionale) Vista o funzione per report: totale spese, dettaglio per compito/spazio; altrimenti le aggregazioni si fanno in frontend o con query dirette.

### 3. Prima voce di menu: Spazi / Lavori

- **Lista spazi**: pagina `/spazi` con i 9 spazi (nome cliccabile o card). Clic su uno spazio → `/spazi/:spazioId` (es. `ingresso`, `cucina`).
- **Lista compiti per spazio**: sotto ogni spazio, elenco di compiti (titolo, date, costo, eseguito sì/no, assegnato a, eseguito da). Pulsanti Modifica / Elimina.
- **Aggiungi compito**: form (modale o pagina) con: titolo, data inizio, data fine (opzionale), costo (opzionale), eseguito (checkbox), assegnato a (select: utente 1 / utente 2, mappati ai due auth.uid()), eseguito da (select, visibile se eseguito = sì). Salvataggio su Supabase.
- **Modifica compito**: stessi campi, precompilati; update su Supabase.

### 4. Seconda voce: Calendario

- **Pagina `/calendario`**: vista tipo **Gantt** o **calendario** (settimana o mese) dove ogni compito è una barra/evento con intervallo `data_inizio`–`data_fine` (se manca data_fine, usare solo data_inizio o “a una data”).
- Per ogni elemento mostrare: titolo, spazio, chi è assegnato / chi ha fatto, stato (da fare / fatto). Colori o icone per distinguere fatto vs da fare.
- Clic su barra/evento → link alla modifica del compito (es. `/spazi/:spazioId` con compito evidenziato o modale).

Suggerimento: usare una libreria leggera (es. FullCalendar, o una timeline semplice) per non reinventare la logica date.

### 5. Terza voce: Report

- **Pagina `/report`** con:
  - **Cose fatte**: elenco compiti con `eseguito = true` (opzionale: raggruppati per spazio).
  - **Cose da fare**: elenco compiti con `eseguito = false`.
  - **Chi ha fatto / deve fare cosa**: tabella o lista (compito, spazio, assegnato_a / eseguito_da con nome/email).
  - **Spese**:
    - Totale speso (somma dei `costo` dei compiti eseguiti).
    - Dettaglio per voce: ogni compito (o per spazio) con relativo costo.
    - **Spesa pro capite**: totale / 2, con etichetta tipo “Totale: X € – Pro capite: Y €”.

Dati letti da Supabase (query o vista); nessuna scrittura in questa sezione.

### 6. Layout e menu

- **Layout** unico: header con titolo “Gestionale Casa” e menu di navigazione (Spazi, Calendario, Report). Su mobile menu hamburger o bottom nav.
- **Logout** in header o menu. Dopo logout → redirect a `/login`.

### 7. UX e PWA

- UI **responsive** (mobile-first): usabile bene da telefono.
- **PWA**: dopo deploy, aprire da Safari (iPhone) e usare “Aggiungi a Home” per l’icona sulla home.
- Non serve dominio a pagamento: usare l’URL Vercel (*.vercel.app).

---

## Riferimenti in repo

- `docs/STRUTTURA_PROGETTO.md`: stack, cartelle, Vercel/Supabase, nessun dominio a pagamento.
- `docs/ARCHITETTURA_E_DATI.md`: elenco spazi, schema tabella `compiti`, flussi, RLS, query per report.

Implementa passo passo: prima setup + auth + CRUD compiti e vista Spazi; poi Calendario; infine Report e rifiniture PWA. Usa TypeScript e mantieni il codice semplice e manutenibile.
