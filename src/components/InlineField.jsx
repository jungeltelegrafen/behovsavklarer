function isoToNorwegian(v) {
  if (!v) return ''
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : v
}

// Grey → Blue → Green, 4 distinct steps
function dotStyle(f) {
  const base = { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.4s' }
  if (f === 0)   return { ...base, background: 'transparent', border: '1.5px solid #D9CFC7' }
  if (f < 0.4)  return { ...base, background: '#D9CFC7' }
  if (f < 0.8)  return { ...base, background: '#7DAACB' }
  return           { ...base, background: '#99BC85' }
}

function fieldFill(value, type, rows) {
  const s = (value || '').trim()
  if (!s) return 0
  if (type === 'textarea' && (rows || 3) >= 3) {
    if (s.length < 40)  return 0.3
    if (s.length < 180) return 0.65
    return 1
  }
  return 1
}

export default function InlineField({
  label, value, onChange, type = 'text',
  options, rows, placeholder,
  suggestion, onAccept, onReject,
}) {
  const fill = fieldFill(value, type, rows)

  const inputClass = `w-full rounded-lg border border-border bg-white/70 px-3 py-1.5 text-sm text-tx
    placeholder:text-tx-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30
    transition-shadow`

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-tx-muted/80">
        <span style={dotStyle(fill)} />
        {label}
      </label>

      {type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows || 3}
          placeholder={placeholder}
          className={`${inputClass} resize-y`}
        />
      ) : type === 'date' ? (
        <input
          type="text"
          value={isoToNorwegian(value)}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}

      {suggestion && (
        <div className="flex items-start gap-2 rounded-lg border border-accent/20 bg-accent-light p-2 text-xs">
          <span className="flex-1 text-tx-muted leading-relaxed">
            <span className="font-semibold text-accent">AI:</span>{' '}
            {Array.isArray(suggestion) ? suggestion.filter(Boolean).join(' · ') : suggestion}
          </span>
          <button onClick={onAccept} className="whitespace-nowrap font-semibold text-accent hover:text-accent/70 transition-colors">
            Bruk
          </button>
          <button onClick={onReject} className="whitespace-nowrap text-tx-muted hover:text-tx transition-colors">
            Avvis
          </button>
        </div>
      )}
    </div>
  )
}
