import './profile-settings.css'

export default function TemplatesPage({ templates = [], onUseTemplate }) {
  return (
    <section className="page-card">
      <h2>Templates</h2>
      <p>Select a template CTA below to continue in the Automation Library.</p>

      <div className="template-grid">
        {templates.map((template) => (
          <article className="template-card" key={template.id}>
            <div className="template-title-row">
              <span className="template-icon">{template.icon}</span>
              <h3>{template.title}</h3>
            </div>
            <p className="helper-text">{template.description}</p>
            <button type="button" className="primary-btn" onClick={() => onUseTemplate?.(template)}>
              Use Template
            </button>
          </article>
        ))}
      </div>

      {templates.length === 0 ? <p className="helper-text">No templates available.</p> : null}
    </section>
  )
}
