import './profile-settings.css'

export default function OperationsPage({ workflowCount }) {
  return (
    <section className="page-card">
      <h2>Operations</h2>
      <p>Operations metrics are powered by workflow records in the backend database.</p>
      <p className="helper-text">Workflows contributing to operations: {workflowCount}</p>
    </section>
  )
}
