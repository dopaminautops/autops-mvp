import './profile-settings.css'

export default function AutomationLibraryPage({ workflowCount, selectedTemplate }) {
  return (
    <section className="page-card">
      <h2>Automation Library</h2>
      <p>Browse reusable automation patterns and templates.</p>
      <p className="helper-text">Available workflows: {workflowCount}</p>

      {selectedTemplate ? (
        <div className="template-card selected-template">
          <div className="template-title-row">
            <span className="template-icon">{selectedTemplate.icon}</span>
            <h3>{selectedTemplate.title}</h3>
          </div>
          <p className="helper-text">{selectedTemplate.description}</p>
          <p className="helper-text">CTA link complete: this template was opened from Templates page.</p>
        </div>
      ) : null}
    </section>
  )
}
