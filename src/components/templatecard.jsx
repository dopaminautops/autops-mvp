import './TemplateCard.css'

function TemplateCard({ template }) {
  const handleUseTemplate = () => {
      console.log('Using template:', template.title)
          // Add your template action here
            }

              return (
                  <div className="template-card" style={{ backgroundColor: template.color }}>
                        <div className="template-header">
                                <span className="template-category">{template.category}</span>
                                      </div>
                                            
                                                  <div className="template-icon">{template.icon}</div>
                                                        
                                                              <h3 className="template-title">{template.title}</h3>
                                                                    
                                                                          <p className="template-description">{template.description}</p>
                                                                                
                                                                                      <button className="use-template-btn" onClick={handleUseTemplate}>
                                                                                              Use Template
                                                                                                    </button>
                                                                                                        </div>
                                                                                                          )
                                                                                                          }

                                                                                                          export default TemplateCard