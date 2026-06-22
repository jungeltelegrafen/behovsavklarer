function d(iso) {
  if (!iso) return ''
  const [y, m, day] = iso.split('-')
  return day ? `${day}.${m}.${y}` : iso
}

function buildText(brief, opts = {}) {
  const { includeClient = false } = opts
  const s = []

  if (brief.kjernenIBehovet) {
    s.push(`KJERNEN I BEHOVET\n${brief.kjernenIBehovet}`)
  }

  const logistics = [
    ['Rolle',             brief.rolle],
    ['Antall konsulenter',brief.antallKonsulenter],
    ['Stillingsprosent',  brief.stillingsprosent],
    ['Oppstartsdato',     d(brief.oppstartsdato)],
    ['Varighet',          brief.varighet],
    ['Lokasjon',          [brief.onsiteRemote, brief.hybridDetaljer, brief.arbeidslokasjon].filter(Boolean).join(' — ')],
    ['Senioritet',        brief.senioritet],
    ['Språkkrav',         brief.spraakkrav],
    ['Budsjett / timepris', brief.budsjett],
    ['Frist CVer',        d(brief.leveransefristCver)],
    ['Søknadsfrist',      d(brief.soknadsfrist)],
  ].filter(([, v]) => v)

  if (logistics.length) {
    s.push(logistics.map(([k, v]) => `${k}: ${v}`).join('\n'))
  }

  if (brief.hvaUtlosteBehovet) s.push(`BAKGRUNN FOR BEHOVET\n${brief.hvaUtlosteBehovet}`)
  if (includeClient && brief.kundebeskrivelse) s.push(`OM KUNDEN\n${brief.kundebeskrivelse}`)
  if (brief.prosjektbeskrivelse) s.push(`PROSJEKTBESKRIVELSE\n${brief.prosjektbeskrivelse}`)
  if (brief.teambeskrivelse)   s.push(`TEAMBESKRIVELSE\n${brief.teambeskrivelse}`)
  if (brief.arbeidsoppgaver)   s.push(`ARBEIDSOPPGAVER\n${brief.arbeidsoppgaver}`)

  if (brief.maHa?.length) {
    s.push('KOMPETANSEKRAV — MÅ HA\n' + brief.maHa.filter(Boolean).map((k, i) => `${i + 1}. ${k}`).join('\n'))
  }
  if (brief.fintAHa?.length) {
    s.push('KOMPETANSEKRAV — FINT Å HA\n' + brief.fintAHa.filter(Boolean).map(k => `• ${k}`).join('\n'))
  }
  if (brief.personligeEgenskaper) s.push(`PERSONLIGE EGENSKAPER\n${brief.personligeEgenskaper}`)
  if (brief.sellingPoints)        s.push(`SELLING POINTS\n${brief.sellingPoints}`)
  if (brief.prosessenVidere)      s.push(`PROSESSEN VIDERE\n${brief.prosessenVidere}`)
  if (brief.andreLeverandorer)    s.push(`ANDRE LEVERANDØRER\n${brief.andreLeverandorer}`)
  if (brief.andreKandidater)      s.push(`ANDRE KANDIDATER\n${brief.andreKandidater}`)
  if (brief.tilbudsformat && brief.tilbudsformat !== 'Standard NC')
                                  s.push(`TILBUDSFORMAT\n${brief.tilbudsformat}`)
  if (brief.annet)                s.push(`ANNET\n${brief.annet}`)
  if (brief.generelleNotater)     s.push(`NOTATER\n${brief.generelleNotater}`)

  return s.join('\n\n')
}

export function copyEmail(brief, opts) {
  const text = buildText(brief, opts)
  return navigator.clipboard.writeText(text)
}

export function downloadEml(brief, opts) {
  const subject = `Oppdragsbeskrivelse — ${brief.rolle || 'Ny forespørsel'}`
  const body = buildText(brief, opts)
  const content = `Subject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
  const blob = new Blob([content], { type: 'message/rfc822' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${slug(brief.rolle || 'behov')}.eml`
  a.click()
  URL.revokeObjectURL(a.href)
}

function slug(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40)
}
