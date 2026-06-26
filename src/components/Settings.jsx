import { useRef, useState } from 'react'
import { useStore, actions } from '../data/store.js'
import { fileToAvatarDataURL } from '../data/photo.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { signOut, deleteAccount, isFirebaseConfigured } from '../auth/firebase.js'

export default function Settings({ onClose }) {
  const photo = useStore((s) => s.photo)
  const { user } = useAuth()
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const name = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Reader')
  const handle = user?.email || '@reader'

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      actions.setPhoto(await fileToAvatarDataURL(file))
    } catch (err) {
      alert('Could not use that image. Try another one.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete your account and all your lists? This cannot be undone.')) return
    try {
      await deleteAccount()
    } catch (e) {
      alert('Please log out and back in, then try deleting again.')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />
        <h3 style={{ marginBottom: 14 }}>Settings</h3>

        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />

        <div className="section-h" style={{ paddingLeft: 0 }}>Profile photo</div>
        <div className="set-photo">
          {photo ? (
            <img className="big-avatar" src={photo} alt="Profile" />
          ) : (
            <div className="big-avatar">{name[0]?.toUpperCase()}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn" style={{ padding: '9px 16px', fontSize: 14 }} disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? 'Uploading…' : photo ? 'Change photo' : 'Upload photo'}
            </button>
            {photo && (
              <button className="btn ghost" style={{ padding: '9px 16px', fontSize: 14 }} onClick={() => actions.setPhoto(null)}>
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="section-h" style={{ paddingLeft: 0 }}>Account</div>
        {isFirebaseConfigured && (
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>Signed in as {handle}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn ghost" onClick={() => signOut()}>Sign out</button>
          {isFirebaseConfigured && (
            <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={handleDelete}>Delete account</button>
          )}
        </div>

        <div className="section-h" style={{ paddingLeft: 0 }}>App</div>
        <button
          className="btn ghost"
          onClick={() => { if (confirm('Reset lit to demo data? (Keeps you signed in.)')) actions.reset() }}
        >
          Reset to demo data
        </button>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 18 }}>lit · version 1.0</div>
      </div>
    </div>
  )
}
