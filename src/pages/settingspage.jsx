import { useEffect, useState } from 'react'
import './profile-settings.css'
import { appApi } from '../services/api'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [status, setStatus] = useState('Loading settings...')
  const [figmaEmail, setFigmaEmail] = useState('')
  const [figmaTeam, setFigmaTeam] = useState('')
  const [figmaStatus, setFigmaStatus] = useState('Checking Figma connection...')

  useEffect(() => {
    appApi
      .getSettings()
      .then((data) => {
        setNotifications(data.notifications)
        setDarkMode(data.dark_mode)
        setStatus(`Synced at ${new Date(data.updated_at).toLocaleString()}`)
      })
      .catch(() => setStatus('Could not load settings'))

    appApi
      .getFigmaConnection()
      .then((data) => {
        if (!data.connected) {
          setFigmaStatus('Figma is not connected')
          return
        }

        setFigmaEmail(data.account_email || '')
        setFigmaTeam(data.team_name || '')
        setFigmaStatus(`Connected to Figma as ${data.account_email}`)
      })
      .catch(() => setFigmaStatus('Could not load Figma connection'))
  }, [])

  const saveSettings = async () => {
    try {
      await appApi.updateSettings({ notifications, dark_mode: darkMode })
      setStatus('Settings saved to database')
    } catch {
      setStatus('Save failed')
    }
  }

  const connectFigma = async () => {
    if (!figmaEmail.trim()) {
      setFigmaStatus('Enter your Figma account email')
      return
    }

    try {
      await appApi.connectFigma({ account_email: figmaEmail.trim(), team_name: figmaTeam.trim() })
      setFigmaStatus(`Connected to Figma as ${figmaEmail.trim()}`)
    } catch {
      setFigmaStatus('Figma connection failed')
    }
  }

  return (
    <section className="page-card">
      <h2>Settings</h2>

      <label className="switch-row">
        <span>Email notifications</span>
        <input type="checkbox" checked={notifications} onChange={() => setNotifications((v) => !v)} />
      </label>

      <label className="switch-row">
        <span>Dark mode</span>
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((v) => !v)} />
      </label>

      <button type="button" className="primary-btn" onClick={saveSettings}>
        Save settings
      </button>
      <p className="helper-text">{status}</p>

      <hr />
      <h3>Connect Figma</h3>
      <input type="email" value={figmaEmail} onChange={(e) => setFigmaEmail(e.target.value)} placeholder="Figma account email" />
      <input type="text" value={figmaTeam} onChange={(e) => setFigmaTeam(e.target.value)} placeholder="Team name (optional)" />
      <button type="button" className="primary-btn" onClick={connectFigma}>
        Connect Figma
      </button>
      <p className="helper-text">{figmaStatus}</p>
    </section>
  )
}
