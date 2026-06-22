import { useRef, useState, useEffect } from 'react'

export default function SourcePanel({
  sourceFiles, pastedText, parsing, extracting, apiAvailable, isLocalhost,
  onFileAdd, onFileRemove, onPasteChange, onExtract, onDistill,
}) {
  const inputRef = useRef()
  const [expanded, setExpanded] = useState(false)
  const hasSource = sourceFiles.length > 0 || pastedText.trim()

  useEffect(() => {
    if (pastedText.length > 120 && !expanded) setExpanded(true)
  }, [pastedText])

  const autoRows = pastedText.length === 0 ? 4 : pastedText.length < 300 ? 8 : 12
  const rows = expanded ? 20 : autoRows

  async function handleDrop(e) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      try { await onFileAdd(file) } catch (err) { alert(err.message) }
    }
  }

  async function handleFileInput(e) {
    const files = Array.from(e.target.files)
    e.target.value = ''
    for (const file of files) {
      try { await onFileAdd(file) } catch (err) { alert(err.message) }
    }
  }

  return (
    <div className="no-print border-b border-border bg-card/50">
      <div className="mx-6 my-3 space-y-2">

        {/* Drop zone */}
        <div
          className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 px-4 py-3
            hover:border-border hover:bg-white/30 transition-colors cursor-pointer"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.eml,.txt"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <span className="text-xl select-none">{parsing ? '⏳' : '📂'}</span>
          <span className="text-sm font-semibold text-tx-muted/80 text-center">
            {parsing
              ? 'Leser fil…'
              : 'Du kan inkludere flere dokumenter — slipp PDF, DOCX, EML eller TXT her, eller klikk for å velge'}
          </span>
        </div>

        {/* File chips */}
        {sourceFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sourceFiles.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full border border-border bg-white/70 px-2.5 py-0.5 text-xs text-tx"
              >
                📄 {f.name}
                <button
                  onClick={() => onFileRemove(i)}
                  className="ml-0.5 text-tx-muted hover:text-tx transition-colors leading-none"
                  title="Fjern"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Paste textarea */}
        <div className="relative">
          <button
            onClick={() => setExpanded(e => !e)}
            className="absolute top-2 right-2.5 z-10 text-xl font-bold text-tx-muted/60
              hover:text-tx-muted transition-colors select-none leading-none"
            title={expanded ? 'Minimer' : 'Utvid'}
          >
            {expanded ? '⊟' : '⊞'}
          </button>
          <textarea
            value={pastedText}
            onChange={e => onPasteChange(e.target.value)}
            rows={rows}
            placeholder="…eller lim inn tekst / e-post direkte her"
            className="w-full rounded-lg border border-border bg-white/60 px-3 py-2 pr-10 text-sm text-tx
              focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none transition-all duration-300
              placeholder:text-center placeholder:text-tx-muted/60"
          />
        </div>

        {/* AI buttons */}
        {hasSource && (
          <div className="flex items-center gap-3">
            {apiAvailable ? (
              <>
                <button
                  onClick={onExtract}
                  disabled={extracting}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white
                    hover:bg-primary/80 disabled:opacity-40 transition-colors"
                >
                  {extracting ? 'Fyller ut…' : 'Fyll ut fra kilde ✦'}
                </button>
                <button
                  onClick={onDistill}
                  disabled={extracting}
                  className="rounded-lg border border-border px-4 py-1.5 text-xs font-semibold text-tx-muted
                    hover:bg-bg hover:text-tx disabled:opacity-40 transition-colors"
                >
                  Destillér kjernen ✦
                </button>
              </>
            ) : isLocalhost ? (
              <span className="text-xs text-tx-muted/60 italic">
                Kobler til AI… start matchcard-landing med <code className="font-mono">npm run dev</code>
              </span>
            ) : null}
            <span className="ml-auto text-xs text-tx-muted/50">
              {[...sourceFiles.map(f => f.text), pastedText]
                .filter(Boolean).join('').length.toLocaleString()} tegn
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
