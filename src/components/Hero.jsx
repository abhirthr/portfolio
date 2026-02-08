import './Hero.css'
import { AnimatedHeroSection } from './ui/animated-hero-section'

function Hero() {
  return (
    <section id="home" className="hero">
      <AnimatedHeroSection />

      <div className="hero__bottom">
        <p className="hero__subtitle">
          PhD Researcher at IIT Roorkee — Machine Learning for Renewable Energy
        </p>
        <div className="hero__scroll-circle">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero
