import { useState } from 'react'
import {
  signUpEmail,
  signInEmail,
  signInGoogle,
  signInApple,
  isFirebaseConfigured,
} from '../auth/firebase.js'

export default function Login() {
  const [mode, setMode] = useState('signup') // signup | login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function run(fn) {
    setError('')
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      setError(prettyError(e))
    } finally {
      setBusy(false)
    }
  }

  const submitEmail = (e) => {
    e.preventDefault()
    run(() => (mode === 'signup' ? signUpEmail(email, password) : signInEmail(email, password)))
  }

  return (
    <div className="phone">
      <div className="auth">
        <div className="auth-logo">lit</div>
        <div className="auth-tag">Rank every book you read</div>

        {!isFirebaseConfigured && (
          <div className="auth-warn">
            Sign-in isn’t configured yet. Add your Firebase keys in
            <br />
            <code>src/auth/firebaseConfig.js</code> (see AUTH_SETUP.md).
          </div>
        )}

        <h2 className="auth-h">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>

        <form onSubmit={submitEmail} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn" type="submit" disabled={busy || !isFirebaseConfigured}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <div className="auth-or">or</div>

        <button className="auth-provider" disabled={busy || !isFirebaseConfigured} onClick={() => run(signInGoogle)}>
          Continue with Google
        </button>
        <button className="auth-provider apple" disabled={busy || !isFirebaseConfigured} onClick={() => run(signInApple)}>
           Continue with Apple
        </button>

        <div className="auth-switch">
          {mode === 'signup' ? 'Already have an account?' : 'New to lit?'}{' '}
          <button onClick={() => { setError(''); setMode(mode === 'signup' ? 'login' : 'signup') }}>
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  )
}

function prettyError(e) {
  const code = e?.code || ''
  if (code.includes('email-already-in-use')) return 'That email already has an account — try logging in.'
  if (code.includes('invalid-email')) return 'Please enter a valid email address.'
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.'
  if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'Incorrect email or password.'
  if (code.includes('user-not-found')) return 'No account found — try signing up.'
  if (code.includes('popup-closed')) return 'Sign-in was cancelled.'
  return e?.message || 'Something went wrong. Please try again.'
}
