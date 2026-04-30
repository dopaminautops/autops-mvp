import './profile-settings.css'

export default function AutomationHubPage({ workflowCount }) {
  return (
    <section className="page-card">
      <h2>Automation Hub</h2>
      <p>Active integration with backend is running.</p>
      <p className="helper-text">Total workflows in database: {workflowCount}</p>
    </section>
  )
}
