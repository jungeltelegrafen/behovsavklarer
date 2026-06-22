import InlineField from './InlineField'
import { ONSITE_OPTIONS, SENIORITY_OPTIONS } from '../data'

function dotStyle(f) {
  const base = { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.4s' }
  if (f === 0)  return { ...base, background: 'transparent', border: '1.5px solid #D9CFC7' }
  if (f < 0.4) return { ...base, background: '#D9CFC7' }
  if (f < 0.8) return { ...base, background: '#7DAACB' }
  return          { ...base, background: '#99BC85' }
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
  const onsiteFill     = 1 // always has a value
  const hybridFill     = has(brief.hybridDetaljer) ? 1 : 0
  const senioritetFill = has(brief.senioritet) ? 1 : 0

  return (
    <aside className="w-[22%] flex-shrink-0 border-r border-border bg-bg/60 p-5 space-y-5 overflow-y-scroll print-col">
      <div className="space-y-4">
        <InlineField label="Rolle" placeholder="f.eks. Senior Java-utvikler" {...f('rolle')} />
        <InlineField label="Antall konsulenter" type="number" placeholder="1" {...f('antallKonsulenter')} />
        <InlineField label="Stillingsprosent" placeholder="100 %" {...f('stillingsprosent')} />
        <InlineField label="Oppstartsdato" type="date" {...f('oppstartsdato')} />
        <InlineField label="Varighet" placeholder="f.eks. 6 måneder" {...f('varighet')} />

        {/* Onsite / Remote */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-tx-muted/80">
            <span style={dotStyle(onsiteFill)} />
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
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-tx-muted/80">
              <span style={dotStyle(hybridFill)} />
              Detaljer hybrid
            </label>
            <input
              type="text"
              value={brief.hybridDetaljer}
              onChange={e => setField('hybridDetaljer', e.target.value)}
              placeholder="f.eks. 3 dager onsite / 2 remote"
              className="w-full rounded-lg border border-border bg-white/70 px-3 py-1.5 text-sm text-tx
                placeholder:text-tx-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
            />
          </div>
        )}

        <InlineField label="Arbeidslokasjon" placeholder="By / kontor" {...f('arbeidslokasjon')} />

        {/* Senioritet */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-tx-muted/80">
            <span style={dotStyle(senioritetFill)} />
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
            className="w-full rounded-lg border border-border bg-white/70 px-3 py-1.5 text-sm text-tx
              placeholder:text-tx-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <p className="text-[11px] font-medium text-tx-muted pt-0.5">
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
