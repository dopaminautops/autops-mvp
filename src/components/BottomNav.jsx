import './BottomNav.css'

export default function BottomNav({ items = [], currentKey }) {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      {items.map((item, index) => (
        <button
          key={item.key}
          className={`nav-item ${currentKey === item.key ? 'active' : ''} ${index === 2 ? 'featured' : ''}`}
          onClick={item.onClick}
          type="button"
        >
          <div className="nav-icon">{item.icon ?? null}</div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </nav>
  )
}
