-- Assegnazione obbligatoria: Cyrolino, Cyrolina, entrambi (testo fisso invece di UUID)
-- Esegui questo script UNA VOLTA in Supabase → SQL Editor → New query → Incolla → Run

-- 1. Rimuovi i vincoli di foreign key dalle colonne UUID
ALTER TABLE compiti DROP CONSTRAINT IF EXISTS compiti_assegnato_a_fkey;
ALTER TABLE compiti DROP CONSTRAINT IF EXISTS compiti_eseguito_da_fkey;

-- 2. Sostituisci assegnato_a (uuid) con assegnato_a (testo)
ALTER TABLE compiti ADD COLUMN assegnato_a_new text;
UPDATE compiti SET assegnato_a_new = 'cyrolina';
ALTER TABLE compiti ALTER COLUMN assegnato_a_new SET NOT NULL;
ALTER TABLE compiti DROP COLUMN assegnato_a;
ALTER TABLE compiti RENAME COLUMN assegnato_a_new TO assegnato_a;
ALTER TABLE compiti ADD CONSTRAINT compiti_assegnato_check CHECK (assegnato_a IN ('cyrolino', 'cyrolina', 'entrambi'));

-- 3. Sostituisci eseguito_da (uuid) con eseguito_da (testo)
ALTER TABLE compiti ADD COLUMN eseguito_da_new text;
ALTER TABLE compiti DROP COLUMN eseguito_da;
ALTER TABLE compiti RENAME COLUMN eseguito_da_new TO eseguito_da;
ALTER TABLE compiti ADD CONSTRAINT compiti_eseguito_da_check CHECK (eseguito_da IS NULL OR eseguito_da IN ('cyrolino', 'cyrolina', 'entrambi'));
