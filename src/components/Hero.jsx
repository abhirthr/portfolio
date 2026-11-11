import './Hero.css'
import SolarDay from './SolarDay'
import { CV_URL, CONTACT_EMAIL } from '../lib/site'

const proof = [
  { label: 'Indian patent granted, 2026', href: '#research' },
  { label: 'First-author paper in Renewable Energy, 2025', href: '#research' },
  { label: 'Live India-wide forecasting app', href: 'https://app.abhijeetrathore.in', external: true },
]

function Hero() {
  return (
    <section id="home" className="hero night">
      <div className="hero__inner container">
        <div className="hero__text">
          <h1 className="hero__name">Abhijeet Rathore</h1>
          <p className="hero__lead">
            Machine learning for solar and wind forecasting. PhD researcher at IIT Roorkee,
            Department of Hydro and Renewable Energy.
          </p>
          <ul className="hero__proof">
            {proof.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  className="link"
                  {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hero__cta">
            {CV_URL && (
              <a className="btn btn--primary" href={CV_URL} download>
                Download CV
              </a>
            )}
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
              Email me
            </a>
          </div>
        </div>

        <div className="hero__chart">
          <SolarDay />
        </div>
      </div>
    </section>
  )
}

export default Hero
