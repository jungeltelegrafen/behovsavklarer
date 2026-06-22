import InlineField from './InlineField'
import { ONSITE_OPTIONS, SENIORITY_OPTIONS } from '../data'

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

export default function LeftColumn({ brief, setField, pendingFill, onAccept, onReject }) {
  function f(key) {
    return {
      value: brief[key],
      onChange: v => setField(key, v),
      suggestion: pendingFill?.[key],
      onAccept: () => onAccept(key),
      onReject: () => onReject(key),
    }
  }

  const has = v => Boolean(v?.trim?.())
  const fields = [
    brief.rolle, brief.antallKonsulenter, brief.stillingsprosent,
    brief.oppstartsdato, brief.varighet, brief.arbeidslokasjon,
    brief.senioritet, brief.spraakkrav, brief.budsjett,
    brief.leveransefristCver, brief.soknadsfrist,
  ]
  const fill = fields.filter(has).length / fields.length

  return (
    <aside
      className="w-[22%] flex-shrink-0 border-r border-border bg-bg/60 p-5 space-y-5 overflow-y-auto print-col border-l-2 transition-colors duration-500"
      style={{ borderLeftColor: bc(fill) }}
    >
      {/* Column heading with dot indicator */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 flex-shrink-0 transition-all duration-500" style={dot(fill)} />
        <span className="text-[9px] font-bold uppercase tracking-widest text-tx-muted/50">Logistikk</span>
      </div>

      <div className="space-y-4">
        <InlineField label="Rolle" placeholder="f.eks. Senior Java-utvikler" {...f('rolle')} />
        <InlineField label="Antall konsulenter" type="number" placeholder="1" {...f('antallKonsulenter')} />
        <InlineField label="Stillingsprosent" placeholder="100 %" {...f('stillingsprosent')} />
        <InlineField label="Oppstartsdato" type="date" {...f('oppstartsdato')} />
        <InlineField label="Varighet" placeholder="f.eks. 6 måneder" {...f('varighet')} />

        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-tx-muted">
            Onsite / Remote
          </label>
          <div className="flex gap-1">
            {ONSITE_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setField('onsiteRemote', opt)}
                className={`flex-1 rounded-lg border py-1 text-[11px] font-semibold transition-colors
                  ${brief.onsiteRemote === opt
                    ? 'border-accent bg-accent text-white'
                    : 'border-border text-tx-muted hover:border-accent/40 hover:text-tx'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {brief.onsiteRemote === 'Hybrid' && (
          <input
            type="text"
            value={brief.hybridDetaljer}
            onChange={e => setField('hybridDetaljer', e.target.value)}
            placeholder="f.eks. 3 dager onsite / 2 remote"
            className="w-full rounded-lg border border-border bg-white/60 px-3 py-1.5 text-sm text-tx
              placeholder:text-tx-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
          />
        )}

        <InlineField label="Arbeidslokasjon" placeholder="By / kontor" {...f('arbeidslokasjon')} />

        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-tx-muted">
            Senioritet
          </label>
          <div className="flex flex-wrap gap-1">
            {SENIORITY_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setField('senioritet', brief.senioritet === opt ? '' : opt)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors
                  ${brief.senioritet === opt
                    ? 'border-accent bg-accent text-white'
                    : 'border-border text-tx-muted hover:border-accent/40 hover:text-tx'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={brief.senioritet && !SENIORITY_OPTIONS.includes(brief.senioritet) ? brief.senioritet : ''}
            onChange={e => setField('senioritet', e.target.value)}
            placeholder="Eller skriv inn…"
            className="w-full rounded-lg border border-border bg-white/60 px-3 py-1.5 text-sm text-tx
              placeholder:text-tx-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 mt-1"
          />
          <p className="text-[10px] italic text-tx-muted/50 pt-0.5">
            Å avklare senioriteten kan avdekke prisforventninger kunden ellers ikke deler åpent
          </p>
        </div>

        <InlineField label="Språkkrav" placeholder="f.eks. Norsk og engelsk" {...f('spraakkrav')} />
        <InlineField
          label="Budsjett / timepris"
          placeholder="Har oppdraget et godkjent budsjett? F.eks. 1 400 kr/t"
          {...f('budsjett')}
        />
        <InlineField label="Leveransefrist CVer" type="date" {...f('leveransefristCver')} />
        <InlineField label="Søknadsfrist" type="date" {...f('soknadsfrist')} />
      </div>
    </aside>
  )
}
