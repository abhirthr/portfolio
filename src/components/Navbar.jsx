import './Navbar.css'

function Navbar({ onMenuToggle }) {
  return (
    <nav className="navbar">
      <button className="navbar__menu-btn" onClick={onMenuToggle}>
        <span className="navbar__hamburger">
          <span></span>
          <span></span>
        </span>
        <span className="navbar__menu-text">Menu</span>
      </button>
      <div className="navbar__logo">A.R.</div>
    </nav>
  )
}

export default Navbar
