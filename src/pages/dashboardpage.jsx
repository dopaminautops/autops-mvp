import './profile-settings.css'

export default function DashboardPage({ workflowCount }) {
  return (
    <section className="page-card">
      <h2>Dashboard</h2>
      <p>Welcome back. Here is your automation overview.</p>
      <p className="helper-text">Active workflows: {workflowCount}</p>
    </section>
  )
}
