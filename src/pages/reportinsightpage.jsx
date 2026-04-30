import './profile-settings.css'

export default function ReportInsightPage({ templateCount, workflowCount }) {
  return (
    <section className="page-card">
      <h2>Report & Insight</h2>
      <p>Review the current pipeline metrics synced from backend data.</p>
      <p className="helper-text">Templates: {templateCount} • Workflows: {workflowCount}</p>
    </section>
  )
}
