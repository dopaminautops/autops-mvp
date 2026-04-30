import { useState } from 'react'
import './drawermenu.css'

function DrawerMenu({ currentPage, menuItems, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const groupedItems = menuItems.reduce((acc, item) => {
    const key = item.category || 'Menu'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const handleItemClick = (pageId) => {
    onNavigate(pageId)
    setIsOpen(false)
  }

  return (
    <>
      <button
        className="drawer-menu-btn"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open menu"
        type="button"
      >
        ☰
      </button>

      {isOpen && <div className="drawer-overlay" onClick={() => setIsOpen(false)} aria-hidden="true" />}

      <aside className={`drawer ${isOpen ? 'open' : ''}`} aria-label="Navigation drawer">
        <div className="drawer-header">
          <h2>Menu</h2>
          <button className="drawer-close-btn" onClick={() => setIsOpen(false)} type="button" aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="drawer-nav">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="drawer-category">
              <p className="drawer-category-label">{category}</p>
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`drawer-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                  type="button"
                >
                  <span className="drawer-item-icon">{item.icon}</span>
                  <span className="drawer-item-label">{item.label}</span>
                  {currentPage === item.id ? <span className="drawer-item-indicator" /> : null}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default DrawerMenu
