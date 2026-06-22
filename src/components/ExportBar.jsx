import { useState } from 'react'
import { copyEmail, downloadEml } from '../lib/exportEmail'
import { exportWord } from '../lib/exportWord'
import { exportPdf } from '../lib/exportPdf'

export default function ExportBar({ brief }) {
  const [copied, setCopied]     = useState(false)
  const [wordBusy, setWordBusy] = useState(false)
  const [pdfBusy, setPdfBusy]   = useState(false)

  async function handleCopyEmail() {
    await copyEmail(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleWord() {
    setWordBusy(true)
    try { await exportWord(brief) } finally { setWordBusy(false) }
  }

  async function handlePdf() {
    setPdfBusy(true)
    try { await exportPdf(brief) } finally { setPdfBusy(false) }
  }

  return (
    <div className="no-print flex-shrink-0 border-t border-border bg-card/90 backdrop-blur-sm px-6 py-3">
      <div className="mx-auto flex max-w-none items-center gap-3 justify-between">
        <span className="text-xs text-tx-muted/60">
          {brief.rolle ? `${brief.rolle} · ` : ''}Eksporter som:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
          >
            {copied ? '✓ Kopiert' : '📧 E-post (kopier)'}
          </button>
          <button
            onClick={() => downloadEml(brief)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Last ned som .eml"
          >
            ↓ .eml
          </button>
          <div className="h-5 w-px bg-border" />
          <button
            onClick={handleWord}
            disabled={wordBusy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📄 {wordBusy ? 'Genererer…' : 'Word'}
          </button>
          <button
            onClick={handlePdf}
            disabled={pdfBusy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📑 {pdfBusy ? 'Genererer…' : 'PDF'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold
              text-white hover:bg-primary/80 transition-colors"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  )
}
