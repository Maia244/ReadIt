import { REVIEWS, SYNOPSES } from './reviews.js'

export function getReviews(id) {
  return REVIEWS[id] || []
}

// Build a balanced, "all voices" consensus from a set of reviews when no
// hand-written synopsis exists (e.g. books pulled live from the API). It
// weighs every review by sentiment and surfaces both praise and criticism.
export function buildConsensus(reviews) {
  if (!reviews || reviews.length === 0) return null
  const n = reviews.length
  const pos = reviews.filter((r) => r.tone === 'pos')
  const neg = reviews.filter((r) => r.tone === 'neg')
  const mixed = reviews.filter((r) => r.tone === 'mixed')
  const favorablePct = Math.round(((pos.length + mixed.length * 0.5) / n) * 100)

  const parts = []
  parts.push(`${favorablePct}% of ${n} reader${n === 1 ? '' : 's'} reviewed it favorably.`)
  if (pos[0]) parts.push(`Many praised it — “${stripQuote(pos[0].text)}.”`)
  if (neg[0]) parts.push(`The main criticism: “${stripQuote(neg[0].text)}.”`)
  else if (mixed[0]) parts.push(`Some had reservations: “${stripQuote(mixed[0].text)}.”`)
  return parts.join(' ')
}

function stripQuote(t) {
  return t.replace(/[.!?]+$/, '')
}

// The consensus to show for a book: a curated synopsis if we have one,
// otherwise an auto-generated one from its reviews.
export function getConsensus(id, reviews) {
  if (SYNOPSES[id]) return { text: SYNOPSES[id], generated: false }
  const built = buildConsensus(reviews)
  return built ? { text: built, generated: true } : null
}
