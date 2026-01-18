import './Header.css'

function Header({ username, title = "Dashboard", hideBackButton = false }) {
  return (
      <header className="header">
            <div className="header-left">
                    {!hideBackButton && (
                              <button className="menu-btn" onClick={() => window.history.back()}>
                                          ‹
                                                    </button>
                                                            )}
                                                                    <h1>{title}</h1>
                                                                          </div>
                                                                                <div className="header-right">
                                                                                        <button className="notification-btn">
                                                                                                  <span className="bell-icon">🔔</span>
                                                                                                          </button>
                                                                                                                  <div className="user-avatar">
                                                                                                                            {username?.charAt(0).toUpperCase()}
                                                                                                                                    </div>
                                                                                                                                          </div>
                                                                                                                                              </header>
                                                                                                                                                )
                                                                                                                                                }

                                                                                                                                                export default Header