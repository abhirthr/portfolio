import './Hero.css'
import { AnimatedHeroSection } from './ui/animated-hero-section'
import { CV_URL, CONTACT_EMAIL } from '../lib/site'

function Hero() {
  return (
    <section id="home" className="hero">
      <AnimatedHeroSection />

      <div className="hero__bottom">
        <p className="hero__subtitle">
          PhD Researcher at IIT Roorkee — Machine Learning for Renewable Energy
        </p>
        <div className="hero__cta">
          {CV_URL && (
            <a className="hero__btn hero__btn--primary" href={CV_URL} download>
              Download CV
            </a>
          )}
          <a className="hero__btn" href={`mailto:${CONTACT_EMAIL}`}>
            Get in touch
          </a>
        </div>
        <a className="hero__scroll-circle" href="#featured" aria-label="Scroll to featured project">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}

export default Hero
