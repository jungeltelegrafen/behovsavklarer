import { useState } from 'react'
import { copyEmail, downloadEml } from '../lib/exportEmail'
import { exportWord } from '../lib/exportWord'
import { exportPdf } from '../lib/exportPdf'
import { copyWordpress } from '../lib/exportWordpress'
import { copyLinkedin } from '../lib/exportLinkedin'

export default function ExportBar({
  brief, apiAvailable, anonymizing, onAnonymize, enrichAvailable, onEnrich,
}) {
  const [copied,      setCopied]      = useState(false)
  const [wpCopied,    setWpCopied]    = useState(false)
  const [liCopied,    setLiCopied]    = useState(false)
  const [wordBusy,    setWordBusy]    = useState(false)
  const [pdfBusy,     setPdfBusy]     = useState(false)
  const [includeClient, setInclude]   = useState(true)

  // Enrich client inline state
  const [enrichOpen,  setEnrichOpen]  = useState(false)
  const [enrichName,  setEnrichName]  = useState('')
  const [enriching,   setEnriching]   = useState(false)
  const [enrichError, setEnrichError] = useState('')

  const opts = { includeClient }

  function openEnrich() {
    // Try to infer company name from first sentence of kundebeskrivelse
    const hint = brief.kundebeskrivelse?.split(/[.\n]/)[0]?.trim() || ''
    setEnrichName(hint)
    setEnrichError('')
    setEnrichOpen(true)
  }

  async function runEnrich() {
    if (!enrichName.trim()) return
    setEnriching(true)
    setEnrichError('')
    try {
      await onEnrich(enrichName.trim())
      setEnrichOpen(false)
    } catch (e) {
      setEnrichError(e.message)
    } finally {
      setEnriching(false)
    }
  }

  async function handleCopyEmail() {
    await copyEmail(brief, opts)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleWord() {
    setWordBusy(true)
    try { await exportWord(brief, opts) } finally { setWordBusy(false) }
  }

  async function handlePdf() {
    setPdfBusy(true)
    try { await exportPdf(brief, opts) } finally { setPdfBusy(false) }
  }

  async function handleWordpress() {
    await copyWordpress(brief, opts)
    setWpCopied(true)
    setTimeout(() => setWpCopied(false), 2000)
  }

  async function handleLinkedin() {
    await copyLinkedin(brief)
    setLiCopied(true)
    setTimeout(() => setLiCopied(false), 2000)
  }

  return (
    <div className="no-print flex-shrink-0 border-t border-border bg-card/90 backdrop-blur-sm px-6 py-2">
      <div className="mx-auto flex max-w-none items-start gap-3 justify-between">

        {/* Left: client controls */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 pt-1">
            {/* Include client checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeClient}
                onChange={e => setInclude(e.target.checked)}
                className="accent-accent w-3.5 h-3.5"
              />
              <span className="text-xs text-tx-muted/70">Inkluder klientbeskrivelse</span>
            </label>

            {/* Enrich button */}
            {enrichAvailable && (
              <button
                onClick={openEnrich}
                disabled={enriching || enrichOpen}
                className="flex items-center gap-1 text-xs font-semibold text-accent/80 hover:text-accent
                  disabled:opacity-40 transition-colors"
              >
                {enriching ? 'Søker…' : 'Berik klient ✦'}
              </button>
            )}

            {/* Anonymize button */}
            {apiAvailable && (
              <button
                onClick={onAnonymize}
                disabled={anonymizing}
                className="flex items-center gap-1 text-xs font-semibold text-tx-muted/60 hover:text-tx-muted
                  disabled:opacity-40 transition-colors"
                title="Fjern klientnavn fra alle felter via AI"
              >
                {anonymizing ? 'Anonymiserer…' : '🔒 Anonymiser ✦'}
              </button>
            )}
          </div>

          {/* Inline enrich widget */}
          {enrichOpen && (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={enrichName}
                onChange={e => setEnrichName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') runEnrich(); if (e.key === 'Escape') setEnrichOpen(false) }}
                placeholder={!enrichName ? 'Skriv inn selskapsnavn…' : ''}
                className="rounded-lg border border-border bg-white px-3 py-1 text-xs text-tx w-52
                  placeholder:text-tx-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                onClick={runEnrich}
                disabled={enriching || !enrichName.trim()}
                className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white
                  hover:bg-primary/80 disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                {enriching ? 'Søker…' : 'Søk'}
              </button>
              <button
                onClick={() => setEnrichOpen(false)}
                className="text-xs text-tx-muted/50 hover:text-tx-muted transition-colors"
              >
                Avbryt
              </button>
              {enrichError && <span className="text-xs text-red-500">{enrichError}</span>}
            </div>
          )}
        </div>

        {/* Right: export buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
          >
            {copied ? '✓ Kopiert' : '📧 E-post'}
          </button>
          <button
            onClick={() => downloadEml(brief, opts)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Last ned som .eml"
          >
            ↓ .eml
          </button>

          <div className="h-5 w-px bg-border" />

          <button
            onClick={handleWordpress}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Kopier HTML for WordPress"
          >
            {wpCopied ? '✓ Kopiert' : '🌐 WordPress'}
          </button>
          <button
            onClick={handleLinkedin}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Kopier LinkedIn-innlegg"
          >
            {liCopied ? '✓ Kopiert' : '💼 LinkedIn'}
          </button>

          <div className="h-5 w-px bg-border" />

          <button
            onClick={handleWord}
            disabled={wordBusy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📄 {wordBusy ? 'Genererer…' : 'Word'}
          </button>
          <button
            onClick={handlePdf}
            disabled={pdfBusy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📑 {pdfBusy ? 'Genererer…' : 'PDF'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold
              text-white hover:bg-primary/80 transition-colors"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  )
}
