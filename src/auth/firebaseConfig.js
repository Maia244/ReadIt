// ┌──────────────────────────────────────────────────────────────────────┐
// │  PASTE YOUR FIREBASE CONFIG HERE                                       │
// │                                                                        │
// │  1. Create a free project at https://console.firebase.google.com      │
// │  2. Add a Web app (</> icon) → copy the firebaseConfig values          │
// │  3. Replace the placeholder strings below.                             │
// │  See AUTH_SETUP.md for the full step-by-step.                          │
// └──────────────────────────────────────────────────────────────────────┘

export const firebaseConfig = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'PASTE_AUTH_DOMAIN',
  projectId: 'PASTE_PROJECT_ID',
  storageBucket: 'PASTE_STORAGE_BUCKET',
  messagingSenderId: 'PASTE_MESSAGING_SENDER_ID',
  appId: 'PASTE_APP_ID',
}

// True once real values have been filled in (used to show a friendly notice
// instead of crashing while the config is still placeholder).
export const isFirebaseConfigured = !Object.values(firebaseConfig).some((v) =>
  String(v).startsWith('PASTE_'),
)
