# Gestionale Casa – Architettura e modello dati

## Spazi (fissi)

Gli spazi sono una lista predefinita, non creata dagli utenti. Valori ammessi:

| id (slug)     | Nome visualizzato |
|---------------|-------------------|
| ingresso      | Ingresso          |
| cucina        | Cucina            |
| soggiorno     | Soggiorno         |
| terrazzo      | Terrazzo          |
| bagno         | Bagno             |
| cameretta     | Cameretta         |
| camera        | Camera            |
| balcone-piccolo | Balcone piccolo |
| varie         | Varie             |

In DB possono essere una tabella `spazi` con queste 9 righe, oppure un enum / costante in frontend + uso dello slug nelle query. Per report e filtri è comodo averli in DB.

---

## Entità principali

### Utenti

- Solo 2: tu e la compagna.
- Gestiti con **Supabase Auth** (email + password). Niente registrazione pubblica: si creano i due account a mano dal pannello Supabase o con una prima “setup” una tantum.
- Per “chi ha fatto/sta facendo” ogni compito: si usa `auth.uid()` (o email) salvato sul compito.

### Compiti (lavori)

Ogni compito rappresenta un lavoro in uno spazio.

| Campo           | Tipo        | Obbligatorio | Descrizione |
|-----------------|-------------|--------------|-------------|
| id              | uuid        | sì           | PK, generato |
| spazio_id       | text/slug   | sì           | Riferimento a uno degli spazi sopra |
| titolo          | text        | sì           | Descrizione breve del lavoro |
| data_inizio     | date        | sì           | Inizio previsto/effettivo |
| data_fine       | date        | no           | Fine prevista/effettiva |
| costo           | decimal     | no           | Spesa in euro (0 se non ancora speso) |
| eseguito        | boolean     | sì           | true = fatto, false = da fare |
| assegnato_a     | uuid (user) | no           | Chi se ne sta occupando (auth.uid()) |
| eseguito_da     | uuid (user) | no           | Chi l’ha completato (auth.uid()) |
| creato_da       | uuid (user) | sì           | Chi ha creato il record |
| creato_il       | timestamptz | sì           | created_at |
| aggiornato_il   | timestamptz | sì           | updated_at |

- Se `eseguito = true`, ha senso compilare `data_fine`, `costo` (se c’è), `eseguito_da`.
- Se `eseguito = false`, si può usare `assegnato_a` per “chi lo sta facendo”.

---

## Menu e sezioni dell’app

### 1. Spazi / Lavori (prima voce di menu)

- **Vista**: elenco dei 9 spazi. Clic su uno spazio → elenco dei compiti di quello spazio.
- **Per ogni spazio**: pulsante “Aggiungi compito” che apre form con: titolo, data inizio, data fine, costo, eseguito sì/no, assegnato a (select: io / compagna), eseguito da (se eseguito = sì).
- **Lista compiti**: per ogni compito mostrare titolo, date, costo, stato (da fare / fatto), chi assegnato / chi ha fatto. Possibilità di modificare ed eliminare.

### 2. Calendario (seconda voce)

- **Vista**: tipo Gantt o calendario settimanale/mensile.
- **Cosa mostrare**: barre o eventi per ogni compito con intervallo `data_inizio`–`data_fine` (se `data_fine` assente, usare solo `data_inizio` o “in corso”).
- **Info su barra/evento**: titolo, spazio, chi è assegnato / chi ha fatto, stato (da fare / fatto). Colore o icona per distinguere fatto vs da fare.
- **Obiettivo**: vedere in quali giorni ci sono lavori e chi se ne occupa.

### 3. Report (terza voce)

- **Cose fatte**: elenco compiti con `eseguito = true` (opzionale: raggruppati per spazio o per data).
- **Cose da fare**: elenco compiti con `eseguito = false` (idem).
- **Chi ha fatto / deve fare cosa**: tabella o lista con compito, spazio, assegnato_a / eseguito_da (nome o email utente).
- **Soldi spesi**:
  - Totale speso: `SUM(costo)` per tutti i compiti con `eseguito = true` (e eventualmente dove costo > 0).
  - Dettaglio per voce: ogni compito (o raggruppato per spazio) con relativo costo.
  - **Spesa pro capite**: totale speso / 2 (solo voi due). Mostrare chiaramente “Totale: X € – Pro capite: X/2 €”.

---

## Flussi utente (sintesi)

1. **Login**: solo i due utenti Supabase possono entrare. Redirect a “Spazi” dopo login.
2. **Spazi**: navigare spazi → aggiungere/modificare/eliminare compiti. Compilare sempre almeno titolo, data inizio, eseguito sì/no; opzionali data fine, costo, assegnato a, eseguito da.
3. **Calendario**: consultazione (e da qui eventuale link al compito per modificarlo).
4. **Report**: sola lettura; dati derivati da query su `compiti` (aggregazioni lato Supabase o lato client).

---

## Sicurezza (Supabase)

- **Row Level Security (RLS)** su tabella `compiti`: tutti i record sono visibili/modificabili solo dagli utenti autenticati (entrambi vedono tutto). Policy tipo: `auth.role() = 'authenticated'` per SELECT/INSERT/UPDATE/DELETE.
- **Spazi**: tabella in sola lettura per tutti gli autenticati (o costante in app senza tabella).
- Nessun “admin” separato: i due account hanno gli stessi permessi.

---

## Query utili per il report

- **Totale speso**: `SELECT SUM(costo) FROM compiti WHERE eseguito = true AND costo IS NOT NULL`.
- **Dettaglio per voce**: `SELECT spazio_id, titolo, costo, eseguito_da FROM compiti WHERE eseguito = true ORDER BY spazio_id, data_fine`.
- **Pro capite**: totale / 2 (calcolato in frontend o in SQL).
- **Cose da fare / fatte**: filtri `WHERE eseguito = true/false` con ordinamento per data o spazio.

Questo documento va usato insieme a `PROMPT_IMPLEMENTAZIONE.md` quando si passa al codice.
