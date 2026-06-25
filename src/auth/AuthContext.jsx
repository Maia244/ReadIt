import { createContext, useContext, useEffect, useState } from 'react'
import { watchAuth, isFirebaseConfigured } from './firebase.js'
import { setUserScope } from '../data/store.js'

const AuthCtx = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsub = watchAuth((u) => {
      setUser(u)
      // Scope each account's lists to its own user id so accounts don't mix.
      setUserScope(u ? u.uid : null)
      setLoading(false)
    })
    return unsub
  }, [])

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
