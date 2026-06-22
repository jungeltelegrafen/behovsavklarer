function d(iso) {
  if (!iso) return ''
  const [y, m, day] = iso.split('-')
  return day ? `${day}.${m}.${y}` : iso
}

export function buildLinkedinPost(brief) {
  const lines = []

  const title = brief.rolle ? `Leter du etter din neste utfordring som ${brief.rolle}?` : 'Ny spennende konsulentmulighet!'
  lines.push(title)
  lines.push('')

  if (brief.kjernenIBehovet) {
    lines.push(brief.kjernenIBehovet)
    lines.push('')
  }

  const bullets = []
  if (brief.arbeidslokasjon || brief.onsiteRemote) {
    const loc = [brief.onsiteRemote, brief.hybridDetaljer, brief.arbeidslokasjon].filter(Boolean).join(' · ')
    if (loc) bullets.push(`📍 ${loc}`)
  }
  if (brief.oppstartsdato) bullets.push(`🗓️ Oppstart: ${d(brief.oppstartsdato)}`)
  if (brief.varighet)      bullets.push(`⏱️ Varighet: ${brief.varighet}`)
  if (brief.stillingsprosent) bullets.push(`💼 Stilling: ${brief.stillingsprosent}`)
  if (brief.soknadsfrist)  bullets.push(`⏰ Søknadsfrist: ${d(brief.soknadsfrist)}`)

  if (bullets.length) {
    lines.push(...bullets)
    lines.push('')
  }

  const maHa = brief.maHa?.filter(Boolean) || []
  if (maHa.length) {
    lines.push('Vi ser etter deg med:')
    maHa.slice(0, 4).forEach(k => lines.push(`✅ ${k}`))
    lines.push('')
  }

  if (brief.sellingPoints) {
    lines.push(brief.sellingPoints)
    lines.push('')
  }

  lines.push('Ta kontakt eller søk via linken under 👇')

  if (brief.webUrl) {
    lines.push('')
    lines.push(brief.webUrl)
  }

  lines.push('')
  lines.push('#konsulent #IT #rekruttering #karriere')

  return lines.join('\n')
}

export function copyLinkedin(brief) {
  return navigator.clipboard.writeText(buildLinkedinPost(brief))
}
