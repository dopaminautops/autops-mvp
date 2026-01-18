import './WorkflowCard.css'

function WorkflowCard({ workflow, onToggle }) {
  return (
      <div className="workflow-card">
            <div className="workflow-header">
                    <h3>{workflow.name}</h3>
                            <label className="workflow-toggle">
                                      <input 
                                                  type="checkbox" 
                                                              checked={workflow.is_active}
                                                                          onChange={onToggle}
                                                                                    />
                                                                                              <span className="toggle-slider"></span>
                                                                                                      </label>
                                                                                                            </div>
                                                                                                                  
                                                                                                                        <div className="workflow-flow">
                                                                                                                                <div className="flow-item">
                                                                                                                                          <span className="flow-icon">{workflow.icon}</span>
                                                                                                                                                    <span className="flow-text">{workflow.trigger}</span>
                                                                                                                                                            </div>
                                                                                                                                                                    <span className="flow-arrow">→</span>
                                                                                                                                                                            <div className="flow-item">
                                                                                                                                                                                      <span className="flow-text">{workflow.action}</span>
                                                                                                                                                                                              </div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                          )
                                                                                                                                                                                                          }

                                                                                                                                                                                                          export default WorkflowCard