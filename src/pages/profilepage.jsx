import { useEffect, useState } from 'react'
import './profile-settings.css'
import { appApi } from '../services/api'

export default function ProfilePage() {
  const [form, setForm] = useState({ name: '', email: '', role: '' })
  const [status, setStatus] = useState('Loading profile...')

  useEffect(() => {
    appApi
      .getProfile()
      .then((data) => {
        setForm({ name: data.name, email: data.email, role: data.role })
        setStatus(`Synced at ${new Date(data.updated_at).toLocaleString()}`)
      })
      .catch(() => setStatus('Could not load profile'))
  }, [])

  const saveProfile = async () => {
    try {
      await appApi.updateProfile(form)
      setStatus('Profile saved to database')
    } catch {
      setStatus('Save failed')
    }
  }

  return (
    <section className="page-card">
      <h2>Profile</h2>

      <label className="field-label">
        Name
        <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
      </label>

      <label className="field-label">
        Email
        <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
      </label>

      <label className="field-label">
        Role
        <input value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} />
      </label>

      <button type="button" className="primary-btn" onClick={saveProfile}>
        Save profile
      </button>
      <p className="helper-text">{status}</p>
    </section>
  )
}
