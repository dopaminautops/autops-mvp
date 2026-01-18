
import React from 'react';
import './AITip.css';

const AITip = ({ text }) => {
  return (
      <div className="ai-tip">
            <div className="ai-icon">✨</div>
                  <div className="ai-content">
                          <h3 className="ai-title">AI Insights</h3>
                                  <p className="ai-text">{text}</p>
                                          <button className="ai-link">View Details →</button>
                                                </div>
                                                    </div>
                                                      );
                                                      };

                                                      export default AITip;