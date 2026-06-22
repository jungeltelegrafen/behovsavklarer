import { useState } from 'react'
import InlineField from './InlineField'
import ListField from './ListField'

export default function CenterColumn({
  brief, setField, pendingFill, onAccept, onReject,
  enrichAvailable, onEnrich,
}) {
  const [enrichName,  setEnrichName]  = useState('')
  const [enriching,   setEnriching]   = useState(false)
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

  async function runEnrich() {
    const name = enrichName.trim()
    if (!name) return
    setEnriching(true)
    setEnrichError('')
    try {
      await onEnrich(name)
      setEnrichName('')
    } catch (e) {
      setEnrichError(e.message)
    } finally {
      setEnriching(false)
    }
  }

  return (
    <main className="flex-1 border-r border-border bg-card p-6 space-y-8 overflow-y-scroll print-col">

      {/* ⭐ Kjernen i behovet */}
      <section className="rounded-xl bg-accent-light/60 p-5 space-y-2" style={{ border: '1px solid rgba(201, 123, 75, 0.2)' }}>
        <label className="text-[11px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
          <span>⭐</span> Kjernen i behovet
        </label>
        <textarea
          value={brief.kjernenIBehovet}
          onChange={e => setField('kjernenIBehovet', e.target.value)}
          rows={3}
          placeholder="Skriv 1–2 setninger som destillerer essensen av behovet. Hva er kunden egentlig ute etter?"
          className="w-full rounded-lg border border-accent/20 bg-white/70 px-4 py-3 text-[15px] font-medium text-tx
            placeholder:text-tx-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none leading-relaxed"
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

      {/* Bakgrunn */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-tx-muted/70">Bakgrunn for behovet</h3>
        <InlineField
          label="Hva utløste behovet?"
          type="textarea" rows={4}
          placeholder="Prosjektoppstart, ny fase, vekst, avgang…"
          {...f('hvaUtlosteBehovet')}
        />
      </section>

      {/* Om kunden */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-tx-muted/70">Om kunden</h3>

        <InlineField
          label="Kundebeskrivelse"
          type="textarea" rows={3}
          placeholder="Hvem er kunden? Bransje, størrelse, team, relevant kontekst…"
          {...f('kundebeskrivelse')}
        />

        {enrichAvailable && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                value={enrichName}
                onChange={e => { setEnrichName(e.target.value); setEnrichError('') }}
                onKeyDown={e => e.key === 'Enter' && runEnrich()}
                placeholder="Selskapsnavn for AI-søk…"
                className="flex-1 rounded-lg border border-border bg-white/60 px-3 py-1.5 text-xs text-tx
                  placeholder:text-tx-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
              />
              <button
                onClick={runEnrich}
                disabled={enriching || !enrichName.trim()}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-tx-muted
                  bg-[#EDE3D8] hover:bg-[#E3D7C8] border border-border/60
                  disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                {enriching ? 'Søker…' : 'Berik ✦'}
              </button>
            </div>
            {enrichError && <p className="text-xs text-red-500">{enrichError}</p>}
          </div>
        )}
      </section>

      {/* Prosjekt og team */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-tx-muted/70">Prosjekt og team</h3>
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
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-tx-muted/70">Kompetansekrav</h3>
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

      {/* Selling points */}
      <section className="space-y-2 pt-2 border-t border-border/40">
        <h3 className="text-center text-[11px] font-bold uppercase tracking-widest text-tx-muted/80">
          Selling points — Hvorfor ta dette oppdraget?
        </h3>
        <textarea
          value={brief.sellingPoints}
          onChange={e => setField('sellingPoints', e.target.value)}
          rows={3}
          placeholder="Faglig utfordring, godt miljø, spennende teknologi, vekstmuligheter…"
          className="w-full rounded-lg border border-border bg-white/60 px-3 py-2 text-sm text-tx
            placeholder:text-tx-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y transition-shadow"
        />
        {pendingFill?.sellingPoints && (
          <div className="flex items-start gap-2 rounded-lg border border-accent/20 bg-accent-light p-2 text-xs">
            <span className="flex-1 text-tx-muted leading-relaxed">
              <span className="font-semibold text-accent">AI:</span> {pendingFill.sellingPoints}
            </span>
            <button onClick={() => onAccept('sellingPoints')} className="whitespace-nowrap font-semibold text-accent hover:text-accent/70">Bruk</button>
            <button onClick={() => onReject('sellingPoints')} className="whitespace-nowrap text-tx-muted hover:text-tx">Avvis</button>
          </div>
        )}
      </section>

    </main>
  )
}
