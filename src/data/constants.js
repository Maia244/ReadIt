// Genre + age-group taxonomy used across the app for filtering and tagging.

export const GENRES = [
  'Fantasy',
  'Sci-Fi',
  'Romance',
  'Mystery',
  'Thriller',
  'Historical',
  'Literary',
  'Non-Fiction',
  'Biography',
  'Self-Help',
  'Horror',
  'Poetry',
]

export const AGE_GROUPS = [
  'Children',
  'Middle Grade',
  'Young Adult',
  'Adult',
]

// Beli-style sentiment buckets used to seed the ranking flow.
export const SENTIMENTS = [
  { key: 'liked', label: 'I liked it!', emoji: '😍', tone: 'good' },
  { key: 'fine', label: 'It was fine', emoji: '🙂', tone: 'ok' },
  { key: 'disliked', label: "Didn't like it", emoji: '😒', tone: 'bad' },
]

// Score buckets map a 0–10 rating to Beli's colour language.
export function scoreTone(score) {
  if (score >= 8) return 'good'
  if (score >= 5) return 'ok'
  return 'bad'
}

// Beli grades scores on a fine green→yellow→red gradient rather than three
// flat buckets. Return the exact badge colour for a 0–10 score.
export function scoreColor(score) {
  if (score >= 9) return '#1a8f5c' // deep green
  if (score >= 8) return '#34a853' // green
  if (score >= 7) return '#7cb342' // yellow-green
  if (score >= 6) return '#c0ca33' // lime
  if (score >= 5) return '#f4c20d' // yellow
  if (score >= 4) return '#f0a020' // amber
  if (score >= 3) return '#ef6c33' // orange
  return '#e23b3b' // red
}
