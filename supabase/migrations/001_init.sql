-- Tabella spazi (9 righe fisse)
CREATE TABLE IF NOT EXISTS spazi (
  id text PRIMARY KEY,
  nome text NOT NULL
);

INSERT INTO spazi (id, nome) VALUES
  ('ingresso', 'Ingresso'),
  ('cucina', 'Cucina'),
  ('soggiorno', 'Soggiorno'),
  ('terrazzo', 'Terrazzo'),
  ('bagno', 'Bagno'),
  ('cameretta', 'Cameretta'),
  ('camera', 'Camera'),
  ('balcone-piccolo', 'Balcone piccolo'),
  ('varie', 'Varie')
ON CONFLICT (id) DO NOTHING;

-- Tabella compiti
CREATE TABLE IF NOT EXISTS compiti (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spazio_id text NOT NULL REFERENCES spazi(id),
  titolo text NOT NULL,
  data_inizio date NOT NULL,
  data_fine date,
  costo decimal(10,2),
  eseguito boolean NOT NULL DEFAULT false,
  assegnato_a uuid REFERENCES auth.users(id),
  eseguito_da uuid REFERENCES auth.users(id),
  creato_da uuid NOT NULL REFERENCES auth.users(id),
  creato_il timestamptz NOT NULL DEFAULT now(),
  aggiornato_il timestamptz NOT NULL DEFAULT now()
);

-- RLS: solo utenti autenticati
ALTER TABLE compiti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read/write compiti"
  ON compiti FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Spazi in sola lettura per autenticati
ALTER TABLE spazi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read spazi"
  ON spazi FOR SELECT
  TO authenticated
  USING (true);
