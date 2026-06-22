import { useState, useEffect } from 'react'
import { EMPTY_BRIEF } from './data'
import { parseFile } from './lib/parseFile'
import SourcePanel from './components/SourcePanel'
import LeftColumn from './components/LeftColumn'
import CenterColumn from './components/CenterColumn'
import RightColumn from './components/RightColumn'
import ExportBar from './components/ExportBar'

const STORAGE_KEY = 'behovsavklarer-v1'

export default function App() {
  // ── State ───────────────────────────────────────────────────────────────
  const [brief, setBrief] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...EMPTY_BRIEF, ...JSON.parse(saved) } : EMPTY_BRIEF
    } catch { return EMPTY_BRIEF }
  })

  const [touched, setTouched]           = useState(new Set())
  const [source, setSource]             = useState('')
  const [sourceFileName, setFileName]   = useState('')
  const [parsing, setParsing]           = useState(false)
  const [extracting, setExtracting]     = useState(false)
  const [apiAvailable, setApiAvail]     = useState(false)
  const [enrichAvailable, setEnrichAvail] = useState(false)
  const [pendingFill, setPending]       = useState(null) // {key: suggestedValue}

  // ── Auto-save ────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(brief)), 400)
    return () => clearTimeout(t)
  }, [brief])

  // ── Check API availability, retry every 5s until both are up ─────────────
  useEffect(() => {
    function check() {
      fetch('/api/req/extract').then(r => r.json())
        .then(d => { if (d.ok && d.configured) setApiAvail(true) }).catch(() => {})
      fetch('/api/req/enrich').then(r => r.json())
        .then(d => { if (d.ok && d.configured) setEnrichAvail(true) }).catch(() => {})
    }
    check()
    const t = setInterval(check, 5000)
    return () => clearInterval(t)
  }, [])

  // ── Field setters ─────────────────────────────────────────────────────────
  function setField(key, value) {
    setBrief(b => ({ ...b, [key]: value }))
    setTouched(t => new Set([...t, key]))
  }

  // ── File drop handler ─────────────────────────────────────────────────────
  async function handleFileDrop(file) {
    setParsing(true)
    try {
      const text = await parseFile(file)
      setSource(text)
      setFileName(file.name)
    } finally {
      setParsing(false)
    }
  }

  // ── AI: fill fields from source ───────────────────────────────────────────
  async function handleExtract() {
    if (!source.trim() || !apiAvailable) return
    setExtracting(true)
    try {
      const res  = await fetch('/api/req/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: source, mode: 'fill' }),
      })
      const data = await res.json()
      applyExtraction(data)
    } catch (e) {
      console.error('Extract error:', e)
    } finally {
      setExtracting(false)
    }
  }

  // ── AI: distil kjernen from current brief ─────────────────────────────────
  async function handleDistill() {
    if (!apiAvailable) return
    setExtracting(true)
    try {
      const text = buildSummaryText(brief)
      const res  = await fetch('/api/req/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: 'distill' }),
      })
      const data = await res.json()
      applyExtraction(data)
    } catch (e) {
      console.error('Distill error:', e)
    } finally {
      setExtracting(false)
    }
  }

  // ── AI: enrich client description from web ───────────────────────────────
  async function handleEnrich(query) {
    const res = await fetch('/api/req/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    if (!res.ok) throw new Error('Berikning feilet')
    const { summary } = await res.json()
    if (!summary) throw new Error('Ingen data returnert')
    if (touched.has('kundebeskrivelse') && brief.kundebeskrivelse) {
      setPending(s => ({ ...(s || {}), kundebeskrivelse: summary }))
    } else {
      setBrief(b => ({ ...b, kundebeskrivelse: summary }))
    }
  }

  // Fill empty/untouched fields immediately; queue suggestions for touched ones
  function applyExtraction(data) {
    const updates     = {}
    const suggestions = {}

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined || value === '') continue
      if (Array.isArray(value) && value.filter(Boolean).length === 0) continue

      const alreadyFilled = Array.isArray(brief[key])
        ? brief[key].filter(Boolean).length > 0
        : Boolean(brief[key])

      if (touched.has(key) && alreadyFilled) {
        suggestions[key] = value
      } else {
        updates[key] = value
      }
    }

    if (Object.keys(updates).length)     setBrief(b => ({ ...b, ...updates }))
    if (Object.keys(suggestions).length) setPending(s => ({ ...(s || {}), ...suggestions }))
  }

  function acceptSuggestion(key) {
    setBrief(b => ({ ...b, [key]: pendingFill[key] }))
    setPending(s => {
      const next = { ...s }; delete next[key]
      return Object.keys(next).length ? next : null
    })
  }

  function rejectSuggestion(key) {
    setPending(s => {
      const next = { ...s }; delete next[key]
      return Object.keys(next).length ? next : null
    })
  }

  function handleClear() {
    if (!confirm('Nullstille hele skjemaet?')) return
    setBrief(EMPTY_BRIEF)
    setTouched(new Set())
    setPending(null)
    setSource('')
    setFileName('')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const colProps = {
    brief, setField, pendingFill,
    onAccept: acceptSuggestion, onReject: rejectSuggestion,
    enrichAvailable, onEnrich: handleEnrich,
  }

  return (
    <div
      className="bg-bg"
      style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr auto', height: '100vh', overflow: 'hidden' }}
    >
      {/* Header — floating rounded card */}
      <div className="no-print px-4 pt-3 pb-2">
        <div className="relative flex items-center justify-center rounded-2xl bg-card border border-border/60 shadow-sm h-11 px-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[15px] font-bold text-accent tracking-tight">matchcard</span>
            <span className="text-border text-sm select-none">·</span>
            <span className="text-[14px] font-semibold text-primary tracking-tight">Behovsavklarer</span>
          </div>
          <div className="absolute right-5 flex items-center gap-4">
            {extracting && <span className="text-xs text-accent animate-pulse">Analyserer…</span>}
            <button onClick={handleClear} className="text-xs text-tx-muted/40 hover:text-tx-muted transition-colors">
              Nullstille
            </button>
          </div>
        </div>
      </div>

      {/* Source panel */}
      <div className="no-print">
        <SourcePanel
          source={source}
          fileName={sourceFileName}
          parsing={parsing}
          extracting={extracting}
          apiAvailable={apiAvailable}
          onFileDrop={handleFileDrop}
          onExtract={handleExtract}
          onDistill={handleDistill}
          onSourceChange={setSource}
        />
      </div>

      {/* Three columns — exactly fills remaining 1fr row */}
      <div className="flex overflow-hidden">
        <LeftColumn   {...colProps} />
        <CenterColumn {...colProps} />
        <RightColumn  {...colProps} />
      </div>

      {/* Export bar — always visible, never clipped */}
      <ExportBar brief={brief} />
    </div>
  )
}

function buildSummaryText(b) {
  return [
    b.rolle             && `Rolle: ${b.rolle}`,
    b.kundebeskrivelse  && `Kunde: ${b.kundebeskrivelse}`,
    b.prosjektbeskrivelse && `Prosjekt: ${b.prosjektbeskrivelse}`,
    b.arbeidsoppgaver   && `Arbeidsoppgaver: ${b.arbeidsoppgaver}`,
    b.maHa?.filter(Boolean).length && `Må ha: ${b.maHa.filter(Boolean).join(', ')}`,
    b.fintAHa?.filter(Boolean).length && `Fint å ha: ${b.fintAHa.filter(Boolean).join(', ')}`,
    b.hvaUtlosteBehovet && `Bakgrunn: ${b.hvaUtlosteBehovet}`,
    b.hvaForventerDere  && `Forventninger: ${b.hvaForventerDere}`,
    b.personligeEgenskaper && `Personlig: ${b.personligeEgenskaper}`,
  ].filter(Boolean).join('\n\n')
}
