import { useState } from 'react'
import InlineField from './InlineField'
import ListField from './ListField'

export default function CenterColumn({
  brief, setField, pendingFill, onAccept, onReject,
  enrichAvailable, onEnrich,
}) {
  const [enrichOpen, setEnrichOpen]   = useState(false)
  const [enrichQuery, setEnrichQuery] = useState('')
  const [enriching, setEnriching]     = useState(false)
  const [enrichError, setEnrichError] = useState('')

  function f(key) {
    return {
      value: brief[key],
      onChange: v => setField(key, v),
      suggestion: pendingFill?.[key],
      onAccept: () => onAccept(key),
      onReject: () => onReject(key),
    }
  }

  function openEnrich() {
    // Pre-fill query from first line of kundebeskrivelse, or rolle
    const firstLine = brief.kundebeskrivelse?.split('\n')[0]?.split('.')[0]?.trim()
    setEnrichQuery(firstLine || brief.rolle || '')
    setEnrichError('')
    setEnrichOpen(true)
  }

  async function runEnrich() {
    if (!enrichQuery.trim()) return
    setEnriching(true)
    setEnrichError('')
    try {
      await onEnrich(enrichQuery.trim())
      setEnrichOpen(false)
    } catch (e) {
      setEnrichError(e.message)
    } finally {
      setEnriching(false)
    }
  }

  return (
    <main className="flex-1 border-r border-border bg-card p-6 space-y-8 overflow-y-auto print-col">

      {/* ⭐ Kjernen i behovet */}
      <section className="rounded-xl border border-accent/20 bg-accent-light/60 p-5 space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent">
          <span>⭐</span> Kjernen i behovet
        </label>
        <textarea
          value={brief.kjernenIBehovet}
          onChange={e => setField('kjernenIBehovet', e.target.value)}
          rows={3}
          placeholder="Skriv 1–2 setninger som destillerer essensen av behovet. Hva er kunden egentlig ute etter?"
          className="w-full rounded-lg border border-accent/20 bg-white/70 px-4 py-3 text-[15px] font-medium text-tx
            placeholder:text-tx-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none leading-relaxed"
        />
        {pendingFill?.kjernenIBehovet && (
          <div className="flex items-start gap-2 rounded-lg border border-accent/30 bg-white/80 p-2 text-xs">
            <span className="flex-1 text-tx-muted">
              <span className="font-semibold text-accent">AI:</span> {pendingFill.kjernenIBehovet}
            </span>
            <button onClick={() => onAccept('kjernenIBehovet')} className="whitespace-nowrap font-semibold text-accent hover:text-accent/70">Bruk</button>
            <button onClick={() => onReject('kjernenIBehovet')} className="whitespace-nowrap text-tx-muted hover:text-tx">Avvis</button>
          </div>
        )}
      </section>

      {/* Bakgrunn — single field, hints at both what triggered + what's expected */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">Bakgrunn for behovet</h3>
        <InlineField
          label="Hva utløste behovet?"
          type="textarea" rows={4}
          placeholder="Prosjektoppstart, ny fase, vekst, avgang…"
          {...f('hvaUtlosteBehovet')}
        />
      </section>

      {/* Om kunden */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">Om kunden</h3>
          {enrichAvailable && !enrichOpen && (
            <button
              onClick={openEnrich}
              className="text-[10px] font-semibold text-accent hover:text-accent/70 transition-colors"
            >
              Berik fra web ✦
            </button>
          )}
        </div>

        <InlineField
          label="Kundebeskrivelse"
          type="textarea" rows={3}
          placeholder="Hvem er kunden? Bransje, størrelse, team, relevant kontekst…"
          {...f('kundebeskrivelse')}
        />

        {enrichOpen && (
          <div className="rounded-lg border border-border bg-bg p-3 space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-tx-muted">
              Søk etter kundeinfo
            </label>
            <div className="flex gap-2">
              <input
                autoFocus
                value={enrichQuery}
                onChange={e => setEnrichQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runEnrich()}
                placeholder="Selskapsnavn…"
                className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-tx
                  placeholder:text-tx-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                onClick={runEnrich}
                disabled={enriching || !enrichQuery.trim()}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white
                  hover:bg-primary/80 disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                {enriching ? 'Søker…' : 'Søk'}
              </button>
              <button
                onClick={() => setEnrichOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-tx-muted
                  hover:bg-bg transition-colors"
              >
                Avbryt
              </button>
            </div>
            {enrichError && (
              <p className="text-xs text-red-500">{enrichError}</p>
            )}
          </div>
        )}
      </section>

      {/* Prosjekt og team */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">Prosjekt og team</h3>
        <InlineField
          label="Prosjektbeskrivelse"
          type="textarea" rows={4}
          placeholder="Hva handler prosjektet om? Mål, teknologi, fase…"
          {...f('prosjektbeskrivelse')}
        />
        <InlineField
          label="Teambeskrivelse"
          type="textarea" rows={2}
          placeholder="Hvem er allerede i teamet? Rapporteringsstruktur…"
          {...f('teambeskrivelse')}
        />
        <InlineField
          label="Arbeidsoppgaver"
          type="textarea" rows={3}
          placeholder="Hva skal konsulenten gjøre i det daglige?"
          {...f('arbeidsoppgaver')}
        />

      </section>

      {/* Kompetansekrav */}
      <section className="space-y-5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">Kompetansekrav</h3>
        <ListField
          label="Må ha"
          items={brief.maHa}
          onChange={v => setField('maHa', v)}
          prominent maxWarning={6}
          suggestion={pendingFill?.maHa}
          onAccept={() => onAccept('maHa')}
          onReject={() => onReject('maHa')}
        />
        <div className="border-t border-border/60 pt-4">
          <ListField
            label="Fint å ha"
            items={brief.fintAHa}
            onChange={v => setField('fintAHa', v)}
            suggestion={pendingFill?.fintAHa}
            onAccept={() => onAccept('fintAHa')}
            onReject={() => onReject('fintAHa')}
          />
        </div>
      </section>

      {/* Personlige egenskaper */}
      <section>
        <InlineField
          label="Personlige egenskaper"
          type="textarea" rows={2}
          placeholder="Selvgående, kommunikativ, analytisk…"
          {...f('personligeEgenskaper')}
        />
      </section>

    </main>
  )
}
