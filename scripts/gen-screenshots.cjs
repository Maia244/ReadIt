const { Resvg } = require('@resvg/resvg-js')
const { PNG } = require('pngjs')
const fs = require('fs')

const W = 1284, H = 2778
const NAVY = '#1b2a6b', NAVY2 = '#33459e', INK = '#14182b', MUTED = '#6b7280', LINE = '#e8eaf2'
const FONTS = ['/tmp/fonts/Inter-Regular.ttf', '/tmp/fonts/Inter-Bold.ttf', '/tmp/fonts/Inter-ExtraBold.ttf', '/tmp/fonts/Fraunces-Italic.ttf']

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function scoreColor(s) {
  if (s >= 9) return '#1a8f5c'; if (s >= 8) return '#34a853'; if (s >= 7) return '#7cb342'
  if (s >= 6) return '#c0ca33'; if (s >= 5) return '#f4c20d'; if (s >= 4) return '#f0a020'
  if (s >= 3) return '#ef6c33'; return '#e23b3b'
}

// Phone screen geometry
const SX = 132, SY = 690, SW = 1020, SH = 1240, RAD = 72

function cover(x, y, w, h, color, title, author) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${color}"/>
    <text x="${x + 10}" y="${y + 28}" font-family="Inter" font-weight="700" font-size="19" fill="#fff">${esc(title)}</text>
    <text x="${x + 10}" y="${y + 52}" font-family="Inter" font-weight="400" font-size="15" fill="#ffffffcc">${esc(author)}</text>`
}
function badge(x, y, score) {
  return `<rect x="${x}" y="${y}" width="86" height="86" rx="20" fill="${scoreColor(score)}"/>
    <text x="${x + 43}" y="${y + 56}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" fill="#fff">${score.toFixed(1)}</text>`
}
function tag(x, y, text, kind) {
  const w = 38 + text.length * 13
  const c = kind === 'age' ? { fg: '#8a5a00', bg: '#fdf1da' } : { fg: NAVY, bg: '#eaedf8' }
  return `<rect x="${x}" y="${y}" width="${w}" height="40" rx="20" fill="${c.bg}"/>
    <text x="${x + w / 2}" y="${y + 27}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="20" fill="${c.fg}">${esc(text)}</text>`
}

// A book list row with rank + score
function listRow(y, rank, color, title, author, score, genre, age) {
  const x = SX + 44
  return `
    <text x="${x}" y="${y + 60}" font-family="Inter" font-weight="800" font-size="34" fill="${MUTED}">${rank}</text>
    ${cover(x + 56, y, 86, 128, color, title, author)}
    <text x="${x + 172}" y="${y + 40}" font-family="Inter" font-weight="700" font-size="32" fill="${INK}">${esc(title)}</text>
    <text x="${x + 172}" y="${y + 76}" font-family="Inter" font-weight="400" font-size="26" fill="${MUTED}">${esc(author)}</text>
    ${tag(x + 172, y + 92, genre)}
    ${tag(x + 172 + 38 + genre.length * 13 + 12, y + 92, age, 'age')}
    ${badge(SX + SW - 130, y + 22, score)}
    <line x1="${x}" y1="${y + 156}" x2="${SX + SW - 44}" y2="${y + 156}" stroke="${LINE}" stroke-width="2"/>`
}

function phoneFrame(inner) {
  return `
    <rect x="${SX - 14}" y="${SY - 14}" width="${SW + 28}" height="${SH + 28}" rx="${RAD + 10}" fill="#0e1430"/>
    <clipPath id="screen"><rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="${RAD}"/></clipPath>
    <rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="${RAD}" fill="#ffffff"/>
    <g clip-path="url(#screen)">${inner}</g>`
}

function appHeader(title, isLogo) {
  const t = isLogo
    ? `<text x="${SX + 44}" y="${SY + 96}" font-family="Fraunces" font-style="italic" font-weight="700" font-size="58" fill="${NAVY}">lit</text>`
    : `<text x="${SX + 44}" y="${SY + 92}" font-family="Inter" font-weight="800" font-size="44" fill="${INK}">${esc(title)}</text>`
  return `<rect x="${SX}" y="${SY}" width="${SW}" height="130" fill="#ffffff"/>${t}
    <line x1="${SX}" y1="${SY + 130}" x2="${SX + SW}" y2="${SY + 130}" stroke="${LINE}" stroke-width="2"/>`
}

function frame(headline, sub, inner) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <text x="${W / 2}" y="320" text-anchor="middle" font-family="Inter" font-weight="800" font-size="84" fill="#ffffff">${esc(headline)}</text>
    <text x="${W / 2}" y="430" text-anchor="middle" font-family="Inter" font-weight="400" font-size="40" fill="#ffffffcc">${esc(sub)}</text>
    ${phoneFrame(inner)}
  </svg>`
}

const BOOKS = [
  ['#1d3557', 'Project Hail Mary', 'Andy Weir', 9.6, 'Sci-Fi', 'Adult'],
  ['#9c6644', 'Circe', 'Madeline Miller', 9.1, 'Fantasy', 'Adult'],
  ['#e63946', 'Evelyn Hugo', 'Taylor J. Reid', 8.7, 'Literary', 'Adult'],
  ['#e76f51', 'Atomic Habits', 'James Clear', 8.2, 'Self-Help', 'Adult'],
  ['#264653', 'The Midnight Library', 'Matt Haig', 7.4, 'Literary', 'Adult'],
]

// Screen 1: ranked list
function screenList() {
  let rows = appHeader('', true)
  let y = SY + 175
  BOOKS.forEach((b, i) => { rows += listRow(y, i + 1, b[0], b[1], b[2], b[3], b[4], b[5]); y += 188 })
  return rows
}

// Screen 2: book detail with AI consensus
function screenDetail() {
  const x = SX + 44
  const consensusLines = [
    'An overwhelming favorite — readers love the',
    'clever problem-solving, humor, and the',
    'emotional friendship at its heart. A few find',
    'the science dense. Best for fans of smart,',
    'optimistic sci-fi.',
  ]
  let c = consensusLines.map((l, i) => `<text x="${x + 36}" y="${SY + 720 + i * 46}" font-family="Inter" font-size="28" fill="${INK}">${esc(l)}</text>`).join('')
  return `${appHeader('', true)}
    ${cover(x, SY + 175, 220, 326, '#1d3557', 'Project Hail Mary', 'Andy Weir')}
    <text x="${x + 256}" y="${SY + 230}" font-family="Inter" font-weight="800" font-size="44" fill="${INK}">Project Hail</text>
    <text x="${x + 256}" y="${SY + 284}" font-family="Inter" font-weight="800" font-size="44" fill="${INK}">Mary</text>
    <text x="${x + 256}" y="${SY + 330}" font-family="Inter" font-size="28" fill="${MUTED}">Andy Weir · 2021</text>
    ${tag(x + 256, SY + 360, 'Sci-Fi')}${tag(x + 256, SY + 414, 'Adult', 'age')}
    ${badge(x + 256, SY + 470, 9.6)}
    <text x="${x + 360}" y="${SY + 528}" font-family="Inter" font-weight="600" font-size="26" fill="${MUTED}">community score</text>
    <rect x="${x}" y="${SY + 600}" width="${SW - 88}" height="320" rx="28" fill="#eaedf8" stroke="#ccd3ee" stroke-width="2"/>
    <rect x="${x + 36}" y="${SY + 636}" width="64" height="44" rx="10" fill="${NAVY}"/>
    <text x="${x + 68}" y="${SY + 667}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="#fff">AI</text>
    <text x="${x + 120}" y="${SY + 668}" font-family="Inter" font-weight="800" font-size="30" fill="${NAVY}">Community consensus</text>
    ${c}`
}

// Screen 3: leaderboard with chips
function screenBoard() {
  const x = SX + 44
  const chips = ['All', 'Young Adult', 'Fantasy', 'Sci-Fi', 'Romance']
  let cx = x, chipSvg = ''
  chips.forEach((ch, i) => {
    const w = 44 + ch.length * 17
    const active = i === 0
    chipSvg += `<rect x="${cx}" y="${SY + 160}" width="${w}" height="58" rx="29" fill="${active ? INK : '#fff'}" stroke="${active ? INK : LINE}" stroke-width="2"/>
      <text x="${cx + w / 2}" y="${SY + 198}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="26" fill="${active ? '#fff' : INK}">${ch}</text>`
    cx += w + 16
  })
  let rows = ''
  let y = SY + 250
  BOOKS.forEach((b, i) => { rows += listRow(y, i + 1, b[0], b[1], b[2], b[3], b[4], b[5]); y += 188 })
  return `${appHeader('Leaderboard')}${chipSvg}${rows}`
}

// Screen 4: search with Books/People toggle
function screenSearch() {
  const x = SX + 44
  let rows = ''
  let y = SY + 350
  BOOKS.slice(0, 4).forEach((b) => {
    rows += `${cover(x, y, 86, 128, b[0], b[1], b[2])}
      <text x="${x + 116}" y="${y + 40}" font-family="Inter" font-weight="700" font-size="32" fill="${INK}">${esc(b[1])}</text>
      <text x="${x + 116}" y="${y + 76}" font-family="Inter" font-size="26" fill="${MUTED}">${esc(b[2])}</text>
      ${tag(x + 116, y + 92, b[4])}
      <rect x="${SX + SW - 200}" y="${y + 36}" width="150" height="60" rx="14" fill="${NAVY}"/>
      <text x="${SX + SW - 125}" y="${y + 76}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" fill="#fff">Rank</text>
      <line x1="${x}" y1="${y + 156}" x2="${SX + SW - 44}" y2="${y + 156}" stroke="${LINE}" stroke-width="2"/>`
    y += 188
  })
  return `${appHeader('Search')}
    <rect x="${x}" y="${SY + 158}" width="${SW - 88}" height="86" rx="18" fill="#f0f1f7"/>
    <text x="${x + 28}" y="${SY + 212}" font-family="Inter" font-size="30" fill="${MUTED}">Search any book, author or genre</text>
    <rect x="${x}" y="${SY + 268}" width="${(SW - 88) / 2 - 8}" height="60" rx="30" fill="${NAVY}"/>
    <text x="${x + (SW - 88) / 4}" y="${SY + 308}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" fill="#fff">Books</text>
    <rect x="${x + (SW - 88) / 2 + 8}" y="${SY + 268}" width="${(SW - 88) / 2 - 8}" height="60" rx="30" fill="#f0f1f7"/>
    <text x="${x + (SW - 88) * 3 / 4}" y="${SY + 308}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" fill="${MUTED}">People</text>
    ${rows}`
}

const shots = [
  ['01-rank', 'Rank every book', 'Compare head-to-head to build your list', screenList()],
  ['02-score', 'A 0–10 score', 'Plus an AI consensus of every reader', screenDetail()],
  ['03-discover', 'Find your next read', 'Filter by genre and age group', screenBoard()],
  ['04-search', 'Search any book', 'Millions of titles, real covers', screenSearch()],
]

fs.mkdirSync('appstore-screenshots', { recursive: true })
for (const [name, head, sub, inner] of shots) {
  const svg = frame(head, sub, inner)
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: FONTS, loadSystemFonts: false } })
  const rendered = r.render()
  const png = new PNG({ width: rendered.width, height: rendered.height })
  Buffer.from(rendered.pixels).copy(png.data)
  fs.writeFileSync(`appstore-screenshots/${name}.png`, PNG.sync.write(png, { colorType: 2 }))
  console.log('wrote', name, rendered.width + 'x' + rendered.height)
}
