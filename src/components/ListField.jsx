export default function ListField({
  label, items = [], onChange,
  prominent = false, maxWarning,
  placeholder = 'Legg til krav...',
  suggestion, onAccept, onReject,
}) {
  function add()           { onChange([...items, '']) }
  function remove(i)       { onChange(items.filter((_, idx) => idx !== i)) }
  function update(i, val)  { onChange(items.map((item, idx) => idx === i ? val : item)) }
  function moveUp(i) {
    if (i === 0) return
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }
  function moveDown(i) {
    if (i === items.length - 1) return
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <label className={`block text-[10px] font-semibold uppercase tracking-widest ${
        prominent ? 'text-primary' : 'text-tx-muted'
      }`}>
        {label}
      </label>

      {items.length === 0 && (
        <p className="text-xs text-tx-muted/50 italic py-1">Ingen krav lagt til ennå</p>
      )}

      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              onClick={() => moveUp(i)}
              disabled={i === 0}
              className="text-[9px] text-tx-muted/40 hover:text-tx-muted disabled:opacity-20 leading-none select-none"
            >▲</button>
            <button
              onClick={() => moveDown(i)}
              disabled={i === items.length - 1}
              className="text-[9px] text-tx-muted/40 hover:text-tx-muted disabled:opacity-20 leading-none select-none"
            >▼</button>
          </div>
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={`${i + 1}.`}
            className={`flex-1 rounded-lg border border-border bg-white/60 px-3 py-1.5 text-sm text-tx
              placeholder:text-tx-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/30
              ${prominent ? 'font-medium' : ''}`}
          />
          <button
            onClick={() => remove(i)}
            className="text-tx-muted/30 hover:text-red-400 transition-colors text-base leading-none px-1 flex-shrink-0"
          >×</button>
        </div>
      ))}

      {maxWarning && items.filter(Boolean).length > maxWarning && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Lang kravspek — hva er essensen?
        </div>
      )}

      <button
        onClick={add}
        className="text-xs text-accent hover:text-accent/70 transition-colors"
      >
        + Legg til
      </button>

      {suggestion && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent-light p-2 text-xs">
          <span className="flex-1 text-tx-muted leading-relaxed">
            <span className="font-semibold text-accent">AI:</span>{' '}
            {(Array.isArray(suggestion) ? suggestion : [suggestion]).filter(Boolean).join(' · ')}
          </span>
          <button
            onClick={onAccept}
            className="whitespace-nowrap font-semibold text-accent hover:text-accent/70 transition-colors"
          >
            Bruk
          </button>
          <button
            onClick={onReject}
            className="whitespace-nowrap text-tx-muted hover:text-tx transition-colors"
          >
            Avvis
          </button>
        </div>
      )}
    </div>
  )
}
