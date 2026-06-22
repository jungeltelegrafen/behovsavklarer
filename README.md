# Behovsavklarer

Turns messy client emails and attachments into a clean, structured consultant-requirement brief — exportable as email, Word, or PDF.

## Kom i gang

```bash
npm install
npm run dev
```

Åpne http://localhost:5174

Alle tre faser fungerer umiddelbart. AI-utfylling (fase 3) krever at matchcard-landing kjører på localhost:3000 — se nedenfor.

## Fase 1 — fungerer uten oppsett
Komplett tre-kolonne skjema, manuell utfylling, og eksport til e-post / Word / PDF.

## Fase 2 — filparsing, ingen AI
Slipp PDF, DOCX, EML eller TXT på droppsonen. Teksten vises i kildefeltet. `.msg`-filer: lagre som `.eml` og slipp den inn.

## Fase 3 — AI-utfylling (valgfritt)
Krever at `matchcard-landing` kjører lokalt med `ANTHROPIC_API_KEY` satt i `.env.local`:

```bash
# I matchcard-landing-mappen:
npm run dev  # starter på localhost:3000
```

Behovsavklarer proxy-er `/api`-kall til localhost:3000. Knappene «Fyll ut fra kilde» og «Destillér kjernen» dukker opp automatisk.

---

## Når du er klar til å publisere

1. Opprett repo `behovsavklarer` (eller et annet navn) under `jungeltelegrafen`-org
2. Sett `"url"` i `matchcard.json` til GitHub Pages-URL
3. Sett `base` i `vite.config.js` til `'/behovsavklarer/'`
4. Push — scan-org-workflowen oppdager `matchcard.json` og åpner en PR til matchcard-portalen automatisk
