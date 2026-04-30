import './profile-settings.css'

export default function HealthPage({ apiStatus }) {
  return (
    <section className="page-card">
      <h2>Health</h2>
      <p>System and backend connectivity status.</p>
      <p className="helper-text">Status: {apiStatus}</p>
    </section>
  )
}
