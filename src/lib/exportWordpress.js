function d(iso) {
  if (!iso) return ''
  const [y, m, day] = iso.split('-')
  return day ? `${day}.${m}.${y}` : iso
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function ul(items) {
  const filtered = (items || []).filter(Boolean)
  if (!filtered.length) return ''
  return '<ul>\n' + filtered.map(i => `<li>${esc(i)}</li>`).join('\n') + '\n</ul>\n'
}

function p(text) {
  return text ? `<p>${esc(text)}</p>\n` : ''
}

export function buildWordpressHtml(brief, opts = {}) {
  const { includeClient = false } = opts
  const parts = []

  if (brief.rolle) {
    parts.push(`<h1>${esc(brief.rolle)}</h1>\n`)
  }

  if (brief.kjernenIBehovet) {
    parts.push(`<h2>Kjernen i behovet</h2>\n${p(brief.kjernenIBehovet)}`)
  }

  // Logistics table
  const logistics = [
    ['Antall konsulenter', brief.antallKonsulenter],
    ['Stillingsprosent',   brief.stillingsprosent],
    ['Oppstartsdato',      d(brief.oppstartsdato)],
    ['Varighet',           brief.varighet],
    ['Lokasjon',           [brief.onsiteRemote, brief.hybridDetaljer, brief.arbeidslokasjon].filter(Boolean).join(' – ')],
    ['Senioritet',         brief.senioritet],
    ['Språkkrav',          brief.spraakkrav],
    ['Søknadsfrist',       d(brief.soknadsfrist)],
  ].filter(([, v]) => v)

  if (logistics.length) {
    parts.push('<ul>\n')
    logistics.forEach(([k, v]) => {
      parts.push(`<li><strong>${esc(k)}:</strong> ${esc(String(v))}</li>\n`)
    })
    parts.push('</ul>\n')
  }

  if (brief.hvaUtlosteBehovet) {
    parts.push(`<h2>Bakgrunn</h2>\n${p(brief.hvaUtlosteBehovet)}`)
  }

  if (includeClient && brief.kundebeskrivelse) {
    parts.push(`<h2>Om kunden</h2>\n${p(brief.kundebeskrivelse)}`)
  }

  if (brief.prosjektbeskrivelse) {
    parts.push(`<h2>Prosjektbeskrivelse</h2>\n${p(brief.prosjektbeskrivelse)}`)
  }

  if (brief.teambeskrivelse) {
    parts.push(`<h2>Teamet</h2>\n${p(brief.teambeskrivelse)}`)
  }

  if (brief.arbeidsoppgaver) {
    parts.push(`<h2>Arbeidsoppgaver</h2>\n${p(brief.arbeidsoppgaver)}`)
  }

  const maHa   = brief.maHa?.filter(Boolean)   || []
  const fintAHa = brief.fintAHa?.filter(Boolean) || []
  if (maHa.length || fintAHa.length) {
    parts.push('<h2>Kompetansekrav</h2>\n')
    if (maHa.length) {
      parts.push('<h3>Må ha</h3>\n' + ul(maHa))
    }
    if (fintAHa.length) {
      parts.push('<h3>Fint å ha</h3>\n' + ul(fintAHa))
    }
  }

  if (brief.personligeEgenskaper) {
    parts.push(`<h2>Personlige egenskaper</h2>\n${p(brief.personligeEgenskaper)}`)
  }

  if (brief.sellingPoints) {
    parts.push(`<h2>Hvorfor dette oppdraget?</h2>\n${p(brief.sellingPoints)}`)
  }

  if (brief.webUrl) {
    parts.push(`<p><a href="${esc(brief.webUrl)}" target="_blank" rel="noopener noreferrer">Les mer og søk her</a></p>\n`)
  }

  return parts.join('')
}

export function copyWordpress(brief, opts) {
  return navigator.clipboard.writeText(buildWordpressHtml(brief, opts))
}
