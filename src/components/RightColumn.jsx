import InlineField from './InlineField'

function dot(f) {
  if (f === 0) return { background: 'transparent', border: '1.5px solid #C8BDB0', borderRadius: '50%' }
  if (f < 0.4) return { background: '#D4C4A8', borderRadius: '50%' }
  if (f < 0.85) return { background: '#C97B4B', borderRadius: '50%' }
  return { background: '#7A9474', borderRadius: '50%' }
}
function bc(f) {
  if (f === 0) return '#E8DDD0'
  if (f < 0.4) return '#D4C4A8'
  if (f < 0.85) return '#C97B4B'
  return '#7A9474'
}

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

  const has = v => Boolean(v?.trim?.())
  const rightFields = [
    brief.prosessenVidere, brief.andreLeverandorer, brief.andreKandidater,
    brief.annet, brief.generelleNotater, brief.tilbudsformat,
  ]
  const fill = rightFields.filter(has).length / rightFields.length

  return (
    <aside
      className="w-[28%] flex-shrink-0 bg-bg/40 p-5 space-y-6 overflow-y-auto print-col border-l-2 transition-colors duration-500"
      style={{ borderLeftColor: bc(fill) }}
    >
      <div>
        {/* Column heading with dot */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-2 h-2 flex-shrink-0 transition-all duration-500" style={dot(fill)} />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">
            Praktisk nyttig info
          </h2>
        </div>

        <div className="space-y-6">

          <InlineField
            label="Web-URL (stillingsannonse)"
            placeholder="https://…"
            {...f('webUrl')}
          />

          <InlineField
            label="Tilbudsformat overfor kunden"
            type="textarea" rows={2}
            placeholder="Hvordan ønsker kunden CV-er presentert? F.eks. NC standard CV, kompetanseskjema, opplasting til kundeportal, kodegjennomgang / GitHub-profil, e-post med vedlegg…"
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
