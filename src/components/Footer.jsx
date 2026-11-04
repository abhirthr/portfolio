import { CONTACT_EMAIL } from '../lib/site'
import './Footer.css'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">A.R.</div>
        <div className="footer__columns">
          <div className="footer__column">
            <h4 className="footer__column-title">Credits</h4>
            <p className="footer__text">&copy; A.R. – 2026</p>
          </div>
          <div className="footer__column">
            <h4 className="footer__column-title">Menu</h4>
            <ul className="footer__links">
              <li><a href="/#home">Home</a></li>
              <li><a href="/#featured">Projects</a></li>
              <li><a href="/#experience">Experience</a></li>
              <li><a href="/#research">Research</a></li>
              <li><a href="/#field">Field work</a></li>
              <li><a href="/#work">Publications</a></li>
              <li><a href="/#about">About</a></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4 className="footer__column-title">Contact</h4>
            <ul className="footer__links">
              <li><a href="https://linkedin.com/in/arthr" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://scholar.google.com/citations?user=NRMwxt8AAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`}>Email</a></li>
              <li><a href="https://github.com/abhirthr" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          <div className="footer__column footer__column--back">
            <button className="footer__back-to-top" onClick={scrollToTop}>
              <span>Back to top</span>
              <div className="footer__back-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 15V3M9 3L4 8M9 3L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
