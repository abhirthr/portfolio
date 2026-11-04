import { motion as Motion } from 'framer-motion'
import BrowserFrame from './ui/browser-frame'
import './FeaturedProject.css'

const steps = [
  {
    title: 'ML-corrected weather forecasts',
    text: 'One India-wide LightGBM model corrects NWP irradiance by learning the clear-sky index from archived forecasts paired with satellite-derived irradiance (NASA POWER). Satellite data is used only in training.',
  },
  {
    title: 'Temperature bias correction',
    text: 'IMD gridded temperature corrects the forecast bias that feeds PV cell temperature and air density.',
  },
  {
    title: 'Physics from weather to power',
    text: 'pvlib clear-sky and PV modelling, hub-height wind extrapolation with hourly shear, and a turbine power curve.',
  },
]

const stack = ['Python', 'LightGBM', 'pvlib', 'pandas', 'FastAPI', 'React', 'Leaflet', 'Render', 'Vercel', 'GitHub Actions']

const RMSE_MAX = 110
const rmse = [
  { label: 'Raw weather forecast', value: 101, cls: 'fp-bar__fill--raw' },
  { label: 'ML-corrected', value: 78, cls: 'fp-bar__fill--model' },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function FeaturedProject() {
  return (
    <section id="featured" className="featured">
      <div className="featured__inner">
        <Motion.p
          className="featured__eyebrow"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          Featured project · Jan – Mar 2026
        </Motion.p>

        <div className="featured__grid">
          <Motion.div
            className="featured__main"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="featured__title">India Renewables Forecast</h2>
            <p className="featured__subtitle">Weather-informed solar &amp; wind baselines</p>
            <p className="featured__desc">
              A forecasting platform that gives a solar and wind baseline for any location in India.
              Click a point on the map to get a 3-day PV and wind generation forecast, alongside the
              long-term resource for that site.
            </p>

            <ol className="featured__steps">
              {steps.map((s, i) => (
                <li key={s.title} className="featured__step">
                  <span className="featured__step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="featured__step-title">{s.title}</h3>
                    <p className="featured__step-text">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <ul className="featured__stack" aria-label="Tech stack">
              {stack.map((t) => (
                <li key={t} className="featured__chip">{t}</li>
              ))}
            </ul>

            <div className="featured__actions">
              <a
                className="featured__btn featured__btn--primary"
                href="https://solar-forecast.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open live app <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Motion.div>

          <Motion.aside
            className="featured__results"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="featured__results-label">Results · trained 2022–23, tested on all of 2024</p>

            <div className="fp-chart">
              <p className="fp-chart__title">Hourly irradiance RMSE at training sites</p>
              {rmse.map((r, i) => (
                <div key={r.label} className="fp-bar">
                  <div className="fp-bar__head">
                    <span>{r.label}</span>
                    <span className="fp-bar__value">{r.value} W/m²</span>
                  </div>
                  <div className="fp-bar__track">
                    <Motion.div
                      className={`fp-bar__fill ${r.cls}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.value / RMSE_MAX) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.2 + i * 0.25, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
              <p className="fp-chart__note">Lower is better. A similar gain holds through the monsoon.</p>
            </div>

            <div className="fp-stats">
              <div className="fp-stat">
                <span className="fp-stat__value">23%</span>
                <span className="fp-stat__label">better than the raw forecast at training sites</span>
              </div>
              <div className="fp-stat">
                <span className="fp-stat__value">10%</span>
                <span className="fp-stat__label">better at 8 sites held out of training entirely</span>
              </div>
            </div>

            <p className="featured__honest">
              The app shows where the model struggles, such as high-altitude Leh, instead of hiding it.
            </p>
          </Motion.aside>
        </div>

        <Motion.figure
          className="featured__shot"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <a href="https://solar-forecast.vercel.app" target="_blank" rel="noopener noreferrer" className="featured__shot-link">
            <BrowserFrame
              url="solar-forecast.vercel.app"
              images={['/images/app/forecast-map.webp', '/images/app/forecast-results.webp']}
              ratio={1440 / 900}
              label="Screenshots of the India Renewables Forecast app: the India map with the 32 test sites coloured by model skill, and the results page"
            />
          </a>
          <figcaption className="featured__shot-caption">
            The live app: click anywhere in India for a forecast. Coloured dots are the 32 test sites, shaded by
            how much the model beats the raw weather forecast. The second view is the results page.
          </figcaption>
        </Motion.figure>
      </div>
    </section>
  )
}

export default FeaturedProject
