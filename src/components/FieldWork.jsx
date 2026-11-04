import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import Lightbox from './ui/lightbox'
import BrowserFrame from './ui/browser-frame'
import './FieldWork.css'

// Station coordinates as printed on the Research Scholars' Day poster.
// dx/dy/anchor place each label so neighbouring stations do not collide.
const stations = [
  { name: 'IIT Roorkee', lat: 29.86, lon: 77.89, dx: 12, dy: 16, anchor: 'start', hub: true },
  { name: 'Saharanpur', lat: 29.96, lon: 77.55, dx: -4, dy: -14, anchor: 'end' },
  { name: 'Kurukshetra', lat: 29.96, lon: 76.87, dx: 0, dy: 26, anchor: 'middle' },
  { name: 'Vikas Nagar', lat: 30.47, lon: 77.76, dx: 12, dy: 5, anchor: 'start' },
  { name: 'Greater Noida', lat: 28.47, lon: 77.5, dx: 12, dy: 5, anchor: 'start' },
  { name: 'Tanakpur', lat: 29.07, lon: 80.1, dx: -12, dy: 5, anchor: 'end' },
]

const LON0 = 76.4
const LAT1 = 30.75
const KX = 150 // px per degree of longitude (≈ cos 29.5° × KY)
const KY = 172 // px per degree of latitude
const project = (s) => ({ x: (s.lon - LON0) * KX + 20, y: (LAT1 - s.lat) * KY + 10 })
const MAP_W = 640
const MAP_H = 455

const parameters = [
  'Global horizontal irradiance',
  'PV module power',
  'Air temperature',
  'Relative humidity',
  'Wind speed & direction',
  'Rainfall',
  'Cloud cover',
]

const POSTER = {
  src: '/images/field/poster-rsd-2023.webp',
  caption: "Poster presented at Research Scholars' Day, IIT Roorkee, 2023",
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function FieldWork() {
  const [open, setOpen] = useState(null)
  const closeLightbox = () => setOpen(null)

  return (
    <section id="field" className="field">
      <Motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <p className="field__eyebrow">Research Engineer · IIT Roorkee · 2022 – 2024</p>
        <h2 className="field__title">From weather stations to a live forecasting service</h2>
        <p className="field__lead">
          Before the PhD I worked across the whole forecasting chain: measurements at six sites in
          North India, the data pipelines behind them, and a commercial web service that delivers
          the forecasts.
        </p>
      </Motion.div>

      <div className="field__grid">
        <Motion.article
          className="field-card field-card--site"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <BrowserFrame
            url="ml-sol.com"
            images={['/images/field/mlsol-home.webp', '/images/field/mlsol-stations.webp']}
            ratio={1440 / 760}
            label="Screenshots of ml-sol.com: the home page and the monitoring-stations page"
          />
          <div className="field-card__body">
            <h3 className="field-card__title">ML-Sol: PV power forecasting service</h3>
            <p className="field-card__text">
              A commercial website that serves solar power forecasts from the six-station network.
              I led its backend development and the integration with the forecasting models.
            </p>
            <ul className="field-points">
              <li>Automated data collection and preprocessing for six sites, cutting manual work by over 90%</li>
              <li>Built Flask and Streamlit interfaces that made the forecasting tools usable by non-specialists</li>
            </ul>
            <a className="field-btn" href="https://www.ml-sol.com" target="_blank" rel="noopener noreferrer">
              Visit ml-sol.com <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Motion.article>

        <Motion.article
          className="field-card"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <h3 className="field-card__title">Six monitoring stations</h3>
          <Motion.svg
            className="station-map"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            role="img"
            aria-label="Relative positions of the six weather stations: IIT Roorkee, Saharanpur, Kurukshetra, Vikas Nagar, Greater Noida and Tanakpur"
          >
            {[77, 78, 79, 80].map((lon) => {
              const x = (lon - LON0) * KX + 20
              return (
                <g key={lon}>
                  <line x1={x} x2={x} y1="0" y2={MAP_H - 24} className="station-map__grid" />
                  <text x={x} y={MAP_H - 6} className="station-map__tick">{lon}°E</text>
                </g>
              )
            })}
            {[29, 30].map((lat) => {
              const y = (LAT1 - lat) * KY + 10
              return (
                <g key={lat}>
                  <line x1="0" x2={MAP_W} y1={y} y2={y} className="station-map__grid" />
                  <text x={MAP_W - 4} y={y - 6} className="station-map__tick station-map__tick--lat">{lat}°N</text>
                </g>
              )
            })}
            {stations.map((s, i) => {
              const { x, y } = project(s)
              return (
                <Motion.g
                  key={s.name}
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { duration: 0.5, delay: 0.2 + i * 0.15 } },
                  }}
                >
                  <circle cx={x} cy={y} r="14" className="station-map__pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                  <circle cx={x} cy={y} r={s.hub ? 7 : 5.5} className={s.hub ? 'station-map__hub' : 'station-map__dot'} />
                  <text x={x + s.dx} y={y + s.dy} textAnchor={s.anchor} className="station-map__label">
                    {s.name}
                  </text>
                </Motion.g>
              )
            })}
          </Motion.svg>
          <p className="field-card__note">Positions to scale by latitude and longitude, from the poster’s coordinates.</p>
          <h4 className="field-card__sub">Measured year-round</h4>
          <ul className="field-chips">
            {parameters.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </Motion.article>
      </div>

      <Motion.article
        className="poster-card"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <button className="poster-card__thumb" onClick={() => setOpen(POSTER)} aria-label="View poster full size">
          <img src={POSTER.src} alt="Poster: A system and method forecasting for solar photovoltaic power using machine learning" loading="lazy" />
        </button>
        <div className="poster-card__body">
          <span className="poster-card__badge">Research Scholars’ Day · IIT Roorkee · 2023</span>
          <h3 className="poster-card__title">A System and Method for Forecasting Solar PV Power Using Machine Learning</h3>
          <p className="poster-card__text">
            The poster presents the project end to end: the objectives (a day-ahead irradiance model for the
            electricity market, year-round data collection, and deployment as a website), the six instrumented
            sites, the experimental setup, and early forecast results from the model that later became the
            <em> Renewable Energy</em> paper and the granted patent.
          </p>
          <button className="field-btn field-btn--ghost" onClick={() => setOpen(POSTER)}>
            View poster
          </button>
        </div>
      </Motion.article>

      <Lightbox item={open} onClose={closeLightbox} />
    </section>
  )
}

export default FieldWork
