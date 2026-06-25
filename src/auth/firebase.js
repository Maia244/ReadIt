import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as fbSignOut,
  deleteUser,
} from 'firebase/auth'
import { Capacitor } from '@capacitor/core'
import { FirebaseAuthentication } from '@capacitor-firebase/authentication'
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig.js'

let auth = null
if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { auth, isFirebaseConfigured }
const native = () => Capacitor.isNativePlatform()

// Subscribe to login state. On native we listen via the plugin AND the web SDK
// stays in sync because we sign in with credentials below.
export function watchAuth(cb) {
  if (!auth) {
    cb(null)
    return () => {}
  }
  return onAuthStateChanged(auth, cb)
}

export function signUpEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function signInEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signInGoogle() {
  if (native()) {
    const res = await FirebaseAuthentication.signInWithGoogle()
    const credential = GoogleAuthProvider.credential(res.credential?.idToken)
    return signInWithCredential(auth, credential)
  }
  return signInWithPopup(auth, new GoogleAuthProvider())
}

export async function signInApple() {
  if (native()) {
    const res = await FirebaseAuthentication.signInWithApple()
    const provider = new OAuthProvider('apple.com')
    const credential = provider.credential({
      idToken: res.credential?.idToken,
      rawNonce: res.credential?.nonce,
    })
    return signInWithCredential(auth, credential)
  }
  const provider = new OAuthProvider('apple.com')
  provider.addScope('email')
  provider.addScope('name')
  return signInWithPopup(auth, provider)
}

export async function signOut() {
  if (native()) {
    try {
      await FirebaseAuthentication.signOut()
    } catch (e) {
      /* ignore */
    }
  }
  return fbSignOut(auth)
}

// Required by Apple (Guideline 5.1.1(v)): in-app account deletion.
export async function deleteAccount() {
  if (native()) {
    try {
      await FirebaseAuthentication.deleteUser()
    } catch (e) {
      /* fall through to web SDK */
    }
  }
  if (auth?.currentUser) return deleteUser(auth.currentUser)
}
