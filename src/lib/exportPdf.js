import jsPDF from 'jspdf'

export function exportPdf(brief, opts = {}) {
  const { includeClient = false } = opts
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const ml = 18
  const pw = 174 // 210 - 2*18
  let y = 22

  function newPage() { doc.addPage(); y = 22 }
  function gap(mm = 4) { y += mm }
  function ensure(mm) { if (y + mm > 282) newPage() }

  function setStyle(size, style, r, g, b) {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    doc.setTextColor(r, g, b)
  }

  function section(label) {
    ensure(10)
    setStyle(7.5, 'bold', 180, 160, 140)
    doc.text(label.toUpperCase(), ml, y)
    y += 4.5
  }

  function para(text, size = 10, style = 'normal', r = 45, g = 45, b = 45) {
    if (!text) return
    ensure(7)
    setStyle(size, style, r, g, b)
    const lines = doc.splitTextToSize(text, pw)
    lines.forEach(line => { ensure(5); doc.text(line, ml, y); y += 5 })
  }

  function kv(label, value) {
    if (!value) return
    ensure(6)
    setStyle(8.5, 'bold', 122, 111, 101)
    doc.text(label + ':', ml, y)
    setStyle(9, 'normal', 45, 45, 45)
    const lines = doc.splitTextToSize(String(value), pw - 56)
    doc.text(lines, ml + 56, y)
    y += Math.max(lines.length * 4.5, 5) + 1.5
  }

  function divider() {
    ensure(5)
    doc.setDrawColor(232, 221, 208)
    doc.line(ml, y, ml + pw, y)
    y += 5
  }

  // ── Title ─────────────────────────────────────────────────────────────────
  setStyle(18, 'bold', 26, 26, 46)
  doc.text('Oppdragsbeskrivelse', ml, y); y += 7
  if (brief.rolle) {
    setStyle(10, 'normal', 122, 111, 101)
    doc.text('Rolle: ' + brief.rolle, ml, y); y += 5
  }
  divider()

  // ── Kjernen ────────────────────────────────────────────────────────────────
  if (brief.kjernenIBehovet) {
    section('Kjernen i behovet')
    para(brief.kjernenIBehovet, 11, 'bolditalic', 201, 123, 75)
    gap(); divider()
  }

  // ── Logistikk ──────────────────────────────────────────────────────────────
  const logRows = [
    ['Rolle',              brief.rolle],
    ['Antall konsulenter', brief.antallKonsulenter],
    ['Stillingsprosent',   brief.stillingsprosent],
    ['Oppstartsdato',      brief.oppstartsdato],
    ['Varighet',           brief.varighet],
    ['Lokasjon',           [brief.onsiteRemote, brief.hybridDetaljer, brief.arbeidslokasjon].filter(Boolean).join(' — ')],
    ['Senioritet',         brief.senioritet],
    ['Språkkrav',          brief.spraakkrav],
    ['Budsjett / timepris',brief.budsjett],
    ['Frist CVer',         brief.leveransefristCver],
    ['Søknadsfrist',       brief.soknadsfrist],
  ].filter(([, v]) => v)

  if (logRows.length) {
    logRows.forEach(([l, v]) => kv(l, v))
    gap(); divider()
  }

  // ── Tekstseksjoner ─────────────────────────────────────────────────────────
  ;[
    ['Bakgrunn for behovet', brief.hvaUtlosteBehovet],
    ['Om kunden',            includeClient ? brief.kundebeskrivelse : null],
    ['Prosjektbeskrivelse',  brief.prosjektbeskrivelse],
    ['Teambeskrivelse',      brief.teambeskrivelse],
    ['Arbeidsoppgaver',      brief.arbeidsoppgaver],
  ].forEach(([label, val]) => {
    if (!val) return
    section(label); para(val); gap()
  })

  // ── Kompetansekrav ─────────────────────────────────────────────────────────
  const maHa   = brief.maHa?.filter(Boolean)   || []
  const fintAHa = brief.fintAHa?.filter(Boolean) || []
  if (maHa.length || fintAHa.length) {
    section('Kompetansekrav')
    if (maHa.length) {
      para('Må ha', 9, 'bold', 45, 45, 45)
      maHa.forEach(k => para('• ' + k))
    }
    if (fintAHa.length) {
      gap(2)
      para('Fint å ha', 9, 'bold', 45, 45, 45)
      fintAHa.forEach(k => para('• ' + k))
    }
    gap()
  }

  if (brief.personligeEgenskaper) { section('Personlige egenskaper'); para(brief.personligeEgenskaper); gap() }
  if (brief.sellingPoints)        { section('Selling points');        para(brief.sellingPoints); gap() }

  if (brief.prosessenVidere || brief.andreLeverandorer || brief.andreKandidater) {
    section('Samarbeidsstruktur')
    if (brief.prosessenVidere)   { para('Prosessen videre:', 9, 'bold'); para(brief.prosessenVidere) }
    if (brief.andreLeverandorer) { para('Andre leverandører:', 9, 'bold'); para(brief.andreLeverandorer) }
    if (brief.andreKandidater)   { para('Andre kandidater:', 9, 'bold'); para(brief.andreKandidater) }
    gap()
  }

  if (brief.annet)            { section('Annet');   para(brief.annet);   gap() }
  if (brief.generelleNotater) { section('Notater'); para(brief.generelleNotater) }

  doc.save(`oppdragsbeskrivelse-${slug(brief.rolle || 'ny')}.pdf`)
}

function slug(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 40)
}
