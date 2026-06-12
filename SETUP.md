# Gutachten-Dashboard — Setup & Deployment

## 1. Supabase einrichten

1. Account anlegen auf https://supabase.com (kostenlos)
2. Neues Projekt erstellen (Name z.B. `gutachten-dashboard`)
3. Im Supabase-Dashboard: **SQL Editor** öffnen
4. Inhalt von `supabase_setup.sql` einfügen und ausführen
5. Unter **Project Settings → API** folgende Werte notieren:
   - `Project URL` → wird zu `VITE_SUPABASE_URL`
   - `anon public` Key → wird zu `VITE_SUPABASE_ANON_KEY`

## 2. Lokale Umgebungsvariablen setzen

```bash
cp .env.example .env
# .env bearbeiten und die Supabase-Werte eintragen:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## 3. Lokal testen

```bash
npm install
npm run dev
# öffnet http://localhost:5173
```

## 4. Auf Vercel deployen

```bash
npm install -g vercel
vercel
# Beim ersten Mal: Projekt einrichten
# Framework: Vite
# Build Command: npm run build
# Output Directory: dist
```

Anschließend im **Vercel Dashboard → Settings → Environment Variables**:
- `VITE_SUPABASE_URL` eintragen
- `VITE_SUPABASE_ANON_KEY` eintragen
- Erneut deployen: `vercel --prod`

## 5. Optional: Realtime aktivieren (Multi-Device-Sync)

Im Supabase Dashboard:
- **Table Editor → gutachten → Realtime** → einschalten

Dann in `src/App.jsx` kann ein `supabase.channel()`-Subscription ergänzt werden
(empfohlen für gleichzeitiges Arbeiten von mehreren Geräten).

## Gutachten-Datenstruktur

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| name | text | Familienname (z.B. „Boujida") |
| aktenzeichen | text | z.B. „44 F 173/24" |
| richterin | text | z.B. „Runte" |
| frist | text | Format TT.MM.JJJJ |
| erledigte | jsonb | `{"aktenexzerpt": true, "exp_mutter": false, ...}` |
| notiz | text | Freies Freitextfeld |

## Maßnahmen anpassen

Alle Maßnahmen-Gruppen und -Items sind in `src/data/massnahmen.js` definiert
und lassen sich einfach erweitern oder umbenennen.
