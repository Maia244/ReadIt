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
