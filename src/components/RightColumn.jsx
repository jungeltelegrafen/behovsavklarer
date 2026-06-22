import InlineField from './InlineField'

export default function RightColumn({ brief, setField, pendingFill, onAccept, onReject }) {
  function f(key) {
    return {
      value: brief[key],
      onChange: v => setField(key, v),
      suggestion: pendingFill?.[key],
      onAccept: () => onAccept(key),
      onReject: () => onReject(key),
      showCheck: true,
    }
  }

  return (
    <aside className="w-[28%] flex-shrink-0 bg-bg/40 p-5 space-y-6 overflow-y-auto print-col">
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-tx-muted mb-4">
          Praktisk nyttig info
        </h2>
        <div className="space-y-6">

          <InlineField
            label="Web-URL (stillingsannonse)"
            placeholder="https://…"
            {...f('webUrl')}
          />

          <InlineField
            label="Tilbudsformat overfor kunden"
            type="textarea" rows={2}
            placeholder="Standard NC — endre ved spesifikke krav fra kunden eller egne preferanser…"
            {...f('tilbudsformat')}
          />

          <section className="space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-tx-muted/70">
              Samarbeidsstruktur kunde ↔ NC
            </h3>
            <InlineField
              label="Prosessen videre?"
              type="textarea" rows={3}
              placeholder="Intervjurunder, tidslinje, beslutningstaker…"
              {...f('prosessenVidere')}
            />
            <InlineField
              label="Andre leverandører?"
              type="textarea" rows={3}
              placeholder="Eksklusivt til NC, eller deler kunden behovet?"
              {...f('andreLeverandorer')}
            />
            <InlineField
              label="Andre kandidater?"
              type="textarea" rows={3}
              placeholder="Er andre konsulenter allerede vurdert?"
              {...f('andreKandidater')}
            />
          </section>

          <InlineField
            label="Annet / Andre behov"
            type="textarea" rows={3}
            placeholder="Tilgrensende behov, planlagte utvidelser…"
            {...f('annet')}
          />

          <InlineField
            label="Generelle notater"
            type="textarea" rows={4}
            placeholder="Intern notis, kontekst fra møte, oppfølgingspunkter…"
            {...f('generelleNotater')}
          />

        </div>
      </div>
    </aside>
  )
}
