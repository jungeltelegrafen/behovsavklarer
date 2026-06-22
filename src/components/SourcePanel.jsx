import { useRef } from 'react'
import { parseFile } from '../lib/parseFile'

export default function SourcePanel({
  sourceFiles, pastedText, parsing, extracting, apiAvailable, isLocalhost,
  onFileAdd, onFileRemove, onPasteChange, onExtract, onDistill,
}) {
  const inputRef = useRef()
  const hasSource = sourceFiles.length > 0 || pastedText.trim()

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
          className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 px-4 py-2.5
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
          <span className="text-lg select-none">{parsing ? '⏳' : '📂'}</span>
          <span className="text-sm text-tx-muted">
            {parsing
              ? 'Leser fil…'
              : sourceFiles.length > 0
                ? 'Slipp flere filer her, eller klikk for å velge'
                : 'Slipp PDF, DOCX, EML eller TXT her — eller klikk for å velge'}
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
        <textarea
          value={pastedText}
          onChange={e => onPasteChange(e.target.value)}
          rows={pastedText ? 3 : 2}
          placeholder="…eller lim inn tekst / e-post direkte her"
          className="w-full rounded-lg border border-border bg-white/60 px-3 py-2 text-xs text-tx-muted
            focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none
            placeholder:text-center placeholder:text-tx-muted/40"
        />

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
