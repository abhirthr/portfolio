import { motion as Motion } from 'framer-motion'
import './Hero.css'
import { AnimatedHeroSection } from './ui/animated-hero-section'
import SunNow from './SunNow'
import { CV_URL, CONTACT_EMAIL } from '../lib/site'

const proof = [
  { label: 'Patent granted 2026', href: '#research' },
  { label: 'Renewable Energy 2025', href: '#research' },
  { label: 'Live forecasting app', href: 'https://app.abhijeetrathore.in', external: true },
]

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

function Hero() {
  return (
    <section id="home" className="hero">
      <h1 className="visually-hidden">Abhijeet Rathore: machine learning for solar and wind forecasting</h1>
      <div className="hero__stage">
        <AnimatedHeroSection />
        <span className="hero__hint" aria-hidden="true">click to serve ↗</span>
      </div>

      <div className="hero__bottom">
        <Motion.p className="hero__headline" {...rise(0.2)}>
          Machine learning for <em>solar</em> &amp; <em>wind</em> forecasting
        </Motion.p>

        <Motion.div className="hero__intro" {...rise(0.3)}>
          <img className="hero__avatar" src="/images/avatar.webp" alt="" width="56" height="56" />
          <p className="hero__subtitle">PhD researcher · IIT Roorkee · Dept. of Hydro and Renewable Energy</p>
        </Motion.div>

        <Motion.ul className="hero__proof" {...rise(0.4)}>
          {proof.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {p.label}
                {p.external && <span aria-hidden="true"> ↗</span>}
              </a>
            </li>
          ))}
        </Motion.ul>

        <Motion.div className="hero__cta" {...rise(0.5)}>
          {CV_URL && (
            <a className="hero__btn hero__btn--primary" href={CV_URL} download>
              Download CV
            </a>
          )}
          <a className="hero__btn" href={`mailto:${CONTACT_EMAIL}`}>
            Get in touch
          </a>
        </Motion.div>

        <Motion.div {...rise(0.6)}>
          <SunNow />
        </Motion.div>

        <a className="hero__scroll-circle" href="#featured" aria-label="Scroll to featured project">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}

export default Hero
