import React from 'react'
import './BottomNav.css'

export default function BottomNav({ items = [] }){
  return (
    <nav className="bottom-nav">
      {items.map(it=> (
        <button key={it.key} className="nav-item" onClick={it.onClick}>
          <div className="nav-icon">{it.icon ?? null}</div>
          <div className="nav-label">{it.label}</div>
        </button>
      ))}
    </nav>
  )
}
