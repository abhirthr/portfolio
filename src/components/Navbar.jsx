import { useEffect, useState } from 'react'
import './Navbar.css'

const LINKS = [
  { id: 'featured', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Publications' },
  { id: 'about', label: 'Contact' },
]

function Navbar({ onMenuToggle }) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(null)

  // Solid bar once the hero is passed, plus a scroll-progress line.
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(window.scrollY > window.innerHeight * 0.6)
        setProgress(max > 0 ? window.scrollY / max : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Highlight the section that crosses the upper third of the screen.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' navbar--solid' : ''}`} aria-label="Main">
      <button className="navbar__menu-btn" onClick={onMenuToggle} aria-label="Open menu">
        <span className="navbar__hamburger" aria-hidden="true">
          <span></span>
          <span></span>
        </span>
        <span className="navbar__menu-text">Menu</span>
      </button>

      <ul className="navbar__links">
        {LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`/#${l.id}`}
              className={`navbar__link${active === l.id ? ' is-active' : ''}`}
              aria-current={active === l.id ? 'true' : undefined}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <a className="navbar__logo" href="/#home" aria-label="Back to top">A.R.</a>
      <span className="navbar__progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </nav>
  )
}

export default Navbar
