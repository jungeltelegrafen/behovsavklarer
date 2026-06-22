import { useState, useRef } from 'react'
import { parseFile } from '../lib/parseFile'

export default function SourcePanel({
  source, fileName, parsing, extracting, apiAvailable,
  onFileDrop, onExtract, onDistill, onSourceChange,
}) {
  const [dragOver, setDragOver] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  async function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    setError('')
    const file = e.dataTransfer.files[0]
    if (!file) return
    try {
      await onFileDrop(file)
      setExpanded(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleFileInput(e) {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    try {
      await onFileDrop(file)
      setExpanded(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="no-print border-b border-border bg-card/50">
      {/* Drop zone */}
      <div
        className={`relative mx-6 my-3 flex items-center gap-4 rounded-xl border-2 border-dashed px-5 py-3 transition-colors cursor-pointer
          ${dragOver
            ? 'border-accent bg-accent-light'
            : source
              ? 'border-border bg-white/40'
              : 'border-border/60 hover:border-border hover:bg-white/30'
          }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx,.eml,.txt" className="hidden" onChange={handleFileInput} />

        <span className="text-xl select-none">{parsing ? '⏳' : source ? '📄' : '📂'}</span>

        <div className="flex-1 min-w-0">
          {parsing ? (
            <span className="text-sm text-tx-muted">Leser fil…</span>
          ) : source ? (
            <span className="text-sm text-tx truncate font-medium">{fileName}</span>
          ) : (
            <span className="text-sm text-tx-muted">
              Slipp PDF, DOCX, EML eller TXT her — eller klikk for å velge
            </span>
          )}
        </div>

        {source && (
          <button
            className="text-xs text-tx-muted hover:text-tx transition-colors flex-shrink-0"
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
          >
            {expanded ? 'Skjul' : 'Vis kilde'}
          </button>
        )}

        {error && (
          <span className="text-xs text-red-500 flex-shrink-0">{error}</span>
        )}
      </div>

      {/* Source text + AI buttons */}
      {source && (
        <div className="mx-6 mb-3 space-y-2">
          {expanded && (
            <textarea
              value={source}
              onChange={e => onSourceChange(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border bg-white/60 px-3 py-2 text-xs text-tx-muted
                focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y font-mono leading-relaxed"
              placeholder="Lim inn tekst eller e-post her…"
            />
          )}

          {!expanded && (
            <textarea
              value={source}
              onChange={e => onSourceChange(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-white/60 px-3 py-2 text-xs text-tx-muted
                focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-mono"
              placeholder="Lim inn tekst her for å bruke AI-utfylling…"
            />
          )}

          <div className="flex items-center gap-3">
            {apiAvailable ? (
              <>
                <button
                  onClick={onExtract}
                  disabled={extracting || !source.trim()}
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
            ) : (
              <span className="text-xs text-tx-muted/60 italic">
                Kobler til AI… start matchcard-landing med <code className="font-mono">npm run dev</code>
              </span>
            )}
            <span className="ml-auto text-xs text-tx-muted/50">
              {source.length.toLocaleString()} tegn
            </span>
          </div>
        </div>
      )}

      {/* Paste-only entry when no source yet */}
      {!source && (
        <div className="mx-6 mb-3">
          <textarea
            rows={2}
            placeholder="…eller lim inn tekst / e-post direkte her"
            className="w-full rounded-lg border border-border bg-white/60 px-3 py-2 text-xs text-tx-muted
              focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none text-center placeholder:text-center"
            onChange={e => {
              if (e.target.value) {
                onSourceChange(e.target.value)
                setExpanded(false)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
