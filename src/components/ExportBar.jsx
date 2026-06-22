import { useState } from 'react'
import { copyEmail, downloadEml } from '../lib/exportEmail'
import { exportWord } from '../lib/exportWord'

export default function ExportBar({ brief }) {
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  async function handleCopyEmail() {
    await copyEmail(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleWord() {
    setExporting(true)
    try {
      await exportWord(brief)
    } finally {
      setExporting(false)
    }
  }

  function handlePrint() {
    window.print()
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
            onClick={downloadEml}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold
              text-tx-muted hover:bg-bg hover:text-tx transition-colors"
            title="Last ned som .eml"
          >
            ↓ .eml
          </button>
          <div className="h-5 w-px bg-border" />
          <button
            onClick={handleWord}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold
              text-tx-muted hover:bg-bg hover:text-tx disabled:opacity-50 transition-colors"
          >
            📄 {exporting ? 'Genererer…' : 'Word'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold
              text-white hover:bg-primary/80 transition-colors"
          >
            🖨️ PDF
          </button>
        </div>
      </div>
    </div>
  )
}
