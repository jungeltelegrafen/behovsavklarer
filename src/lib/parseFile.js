// Lazy-loads heavy parsers only when a file of that type is dropped.

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'pdf') {
    const pdfjsLib = await import('pdfjs-dist')
    // Use CDN worker to avoid Vite bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map(item => item.str).join(' ') + '\n'
    }
    return text.trim()
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  }

  if (ext === 'eml') {
    const { default: PostalMime } = await import('postal-mime')
    const text = await file.text()
    const email = await PostalMime.parse(text)
    const parts = []
    if (email.subject) parts.push(`Emne: ${email.subject}`)
    if (email.from?.name || email.from?.address) {
      parts.push(`Fra: ${[email.from.name, email.from.address].filter(Boolean).join(' ')}`)
    }
    if (email.date) parts.push(`Dato: ${email.date}`)
    parts.push('')
    if (email.text) {
      parts.push(email.text)
    } else if (email.html) {
      parts.push(email.html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' '))
    }
    return parts.join('\n').trim()
  }

  if (ext === 'txt') {
    return (await file.text()).trim()
  }

  if (ext === 'msg') {
    throw new Error('.msg støttes ikke direkte. Lagre e-posten som .eml i Outlook og slipp den inn igjen.')
  }

  throw new Error(`Filformat .${ext} støttes ikke. Prøv PDF, DOCX, EML eller TXT.`)
}
