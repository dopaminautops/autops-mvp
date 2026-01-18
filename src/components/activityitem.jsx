import './ActivityItem.css'

function ActivityItem({ activity }) {
  const getCategoryColor = (category) => {
      switch(category) {
            case 'workflow': return '#5B7FFF'
                  case 'ai': return '#9B59B6'
                        case 'system': return '#00D9A5'
                              default: return '#999'
                                  }
                                    }

                                      return (
                                          <div className="activity-item">
                                                <div 
                                                        className="activity-icon-circle"
                                                                style={{ backgroundColor: `${getCategoryColor(activity.category)}20` }}
                                                                      >
                                                                              <span className="activity-icon">{activity.icon}</span>
                                                                                    </div>
                                                                                          <div className="activity-content">
                                                                                                  <h4 className="activity-title">{activity.title}</h4>
                                                                                                          <p className="activity-time">{activity.time_ago}</p>
                                                                                                                </div>
                                                                                                                    </div>
                                                                                                                      )
                                                                                                                      }

                                                                                                                      export default ActivityItem