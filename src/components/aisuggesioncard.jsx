import './AISuggestionCard.css'

function AISuggestionCard({ suggestion, onTryNow }) {
  return (
      <div className="ai-suggestion-card">
            <div className="suggestion-icon">{suggestion.icon}</div>
                  <p className="suggestion-description">{suggestion.description}</p>
                        <button className="try-now-btn" onClick={onTryNow}>
                                Try Now
                                      </button>
                                          </div>
                                            )
                                            }

                                            export default AISuggestionCard