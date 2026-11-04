import './MenuOverlay.css'

function MenuOverlay({ isOpen, onClose }) {
  return (
    <div className={`menu-overlay ${isOpen ? 'menu-overlay--open' : ''}`}>
      <div className="menu-overlay__backdrop" onClick={onClose} />
      <div className="menu-overlay__panel">
        <button className="menu-overlay__close" onClick={onClose}>
          <span className="menu-overlay__close-icon">&times;</span>
          <span>Close</span>
        </button>
        <nav className="menu-overlay__nav">
          <a href="#home" className="menu-overlay__link" onClick={onClose}>Home</a>
          <a href="#featured" className="menu-overlay__link" onClick={onClose}>Projects</a>
          <a href="#experience" className="menu-overlay__link" onClick={onClose}>Experience</a>
          <a href="#research" className="menu-overlay__link" onClick={onClose}>Research</a>
          <a href="#field" className="menu-overlay__link" onClick={onClose}>Field work</a>
          <a href="#work" className="menu-overlay__link" onClick={onClose}>Publications</a>
          <a href="#about" className="menu-overlay__link" onClick={onClose}>About</a>
          <a href="https://github.com/abhirthr" className="menu-overlay__link" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
    </div>
  )
}

export default MenuOverlay
