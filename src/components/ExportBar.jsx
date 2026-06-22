import { useState } from 'react'
import { copyEmail, downloadEml } from '../lib/exportEmail'
import { exportWord } from '../lib/exportWord'
import { exportPdf } from '../lib/exportPdf'
import { copyWordpress } from '../lib/exportWordpress'
import { copyLinkedin } from '../lib/exportLinkedin'

export default function ExportBar({ brief, apiAvailable, anonymizing, onAnonymize }) {
  const [copied,    setCopied]    = useState(false)
  const [wpCopied,  setWpCopied]  = useState(false)
  const [liCopied,  setLiCopied]  = useState(false)
  const [wordBusy,  setWordBusy]  = useState(false)
  const [pdfBusy,   setPdfBusy]   = useState(false)
  const [includeClient, setInclude] = useState(false)

  const opts = { includeClient }

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
    <div className="no-print flex-shrink-0 border-t border-border bg-card/90 backdrop-blur-sm px-6 py-3">
      <div className="mx-auto flex max-w-none items-center gap-3 justify-between">

        {/* Left: client toggle + anonymize */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeClient}
              onChange={e => setInclude(e.target.checked)}
              className="accent-accent w-3.5 h-3.5"
            />
            <span className="text-xs text-tx-muted/70">Inkluder kundebeskrivelse</span>
          </label>
          {apiAvailable && (
            <button
              onClick={onAnonymize}
              disabled={anonymizing}
              className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs
                font-semibold text-tx-muted/70 hover:bg-bg hover:text-tx disabled:opacity-40 transition-colors"
              title="Fjern klientnavn fra alle felter via AI"
            >
              {anonymizing ? 'Anonymiserer…' : '🔒 Anonymiser ✦'}
            </button>
          )}
        </div>

        {/* Right: export buttons */}
        <div className="flex items-center gap-2">
          {/* Email */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
          >
            {copied ? '✓ Kopiert' : '📧 E-post'}
          </button>
          <button
            onClick={() => downloadEml(brief, opts)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Last ned som .eml"
          >
            ↓ .eml
          </button>

          <div className="h-5 w-px bg-border" />

          {/* WordPress */}
          <button
            onClick={handleWordpress}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Kopier HTML for WordPress"
          >
            {wpCopied ? '✓ Kopiert' : '🌐 WordPress'}
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedin}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Kopier LinkedIn-innlegg"
          >
            {liCopied ? '✓ Kopiert' : '💼 LinkedIn'}
          </button>

          <div className="h-5 w-px bg-border" />

          {/* Word + PDF + Print */}
          <button
            onClick={handleWord}
            disabled={wordBusy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📄 {wordBusy ? 'Genererer…' : 'Word'}
          </button>
          <button
            onClick={handlePdf}
            disabled={pdfBusy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📑 {pdfBusy ? 'Genererer…' : 'PDF'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold
              text-white hover:bg-primary/80 transition-colors"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  )
}
