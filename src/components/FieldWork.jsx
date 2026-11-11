import { useState } from 'react'
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
  'Wind speed and direction',
  'Rainfall',
  'Cloud cover',
]

const POSTER = {
  src: '/images/field/poster-rsd-2023.webp',
  caption: "Poster presented at Research Scholars' Day, IIT Roorkee, 2023",
}

const PHOTOS = [
  {
    src: '/images/field/poster-day-2023.webp',
    alt: 'Abhijeet Rathore standing beside the solar PV forecasting poster',
    caption: 'Presenting the six-station forecasting project at Research Scholars’ Day, IIT Roorkee, 2023',
    shape: 'tall',
    focus: '50% 40%',
  },
  {
    src: '/images/field/booth-workshop-2025.webp',
    alt: 'Abhijeet Rathore at the Machine Learning Based Solar PV Forecasting booth with the ML-Sol banner',
    caption: 'Demonstrating ML-Sol at the Workshop on Sustainable Energy Innovations, IIT Roorkee Greater Noida, January 2025',
    shape: 'tall',
    focus: '50% 45%',
  },
  {
    src: '/images/field/monitoring-wall.webp',
    alt: 'Abhijeet Rathore explaining the station monitoring displays to a group of visitors',
    caption: 'Walking visitors through the live station-monitoring wall',
    shape: 'wide',
    focus: '40% 50%',
  },
]

function FieldWork() {
  const [open, setOpen] = useState(null)
  const closeLightbox = () => setOpen(null)

  return (
    <section id="field" className="field day section">
      <div className="container">
        <div className="section-head">
          <p className="section-head__note">Research engineer at IIT Roorkee, 2022 to 2024</p>
          <h2 className="section-head__title">From weather stations to a live forecasting service</h2>
          <p className="section-head__lead">
            Before the PhD I worked across the whole forecasting chain: measurements at six sites in
            North India, the data pipelines behind them, and a commercial web service that delivers
            the forecasts.
          </p>
        </div>

        <div className="field__grid">
          <article className="field-card field-card--site">
            <BrowserFrame
              url="ml-sol.com"
              images={['/images/field/mlsol-home.webp', '/images/field/mlsol-stations.webp']}
              ratio={1440 / 760}
              label="Screenshots of ml-sol.com: the home page and the monitoring-stations page"
            />
            <div className="field-card__body">
              <h3 className="field-card__title">ML-Sol, a PV power forecasting service</h3>
              <p className="field-card__text">
                A commercial website that serves solar power forecasts from the six-station network.
                I led its backend development and the integration with the forecasting models.
              </p>
              <ul className="field-points">
                <li>Automated data collection and preprocessing for six sites, cutting manual work by over 90%</li>
                <li>Built Flask and Streamlit interfaces that made the forecasting tools usable by non-specialists</li>
              </ul>
              <a className="btn" href="https://www.ml-sol.com" target="_blank" rel="noopener noreferrer">
                Visit ml-sol.com
              </a>
            </div>
          </article>

          <article className="field-card">
            <h3 className="field-card__title">Six monitoring stations</h3>
            <svg
              className="station-map"
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
                  <g key={s.name}>
                    <circle cx={x} cy={y} r="14" className="station-map__pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                    <circle cx={x} cy={y} r={s.hub ? 7 : 5.5} className={s.hub ? 'station-map__hub' : 'station-map__dot'} />
                    <text x={x + s.dx} y={y + s.dy} textAnchor={s.anchor} className="station-map__label">
                      {s.name}
                    </text>
                  </g>
                )
              })}
            </svg>
            <p className="field-card__note">Positions to scale by latitude and longitude, from the poster’s coordinates.</p>
            <h4 className="field-card__sub">Measured year-round</h4>
            <p className="field-card__params">{parameters.join(', ')}.</p>
          </article>
        </div>

        <article className="poster-card">
          <button className="poster-card__thumb" onClick={() => setOpen(POSTER)} aria-label="View poster full size">
            <img src={POSTER.src} alt="Poster: A system and method forecasting for solar photovoltaic power using machine learning" loading="lazy" />
          </button>
          <div className="poster-card__body">
            <p className="poster-card__note">Research Scholars’ Day, IIT Roorkee, 2023</p>
            <h3 className="poster-card__title">A System and Method for Forecasting Solar PV Power Using Machine Learning</h3>
            <p className="poster-card__text">
              The poster presents the project end to end: the objectives (a day-ahead irradiance model for the
              electricity market, year-round data collection, and deployment as a website), the six instrumented
              sites, the experimental setup, and early forecast results from the model that later became the
              <em> Renewable Energy</em> paper and the granted patent.
            </p>
            <button className="btn" onClick={() => setOpen(POSTER)}>
              View the poster
            </button>
          </div>
        </article>

        <div className="field-photos">
          <h3 className="field-photos__title">Out in the field</h3>
          <div className="field-photos__grid">
            {PHOTOS.map((p) => (
              <button key={p.src} className={`field-photo field-photo--${p.shape}`} onClick={() => setOpen(p)}>
                <img src={p.src} alt={p.alt} loading="lazy" style={{ objectPosition: p.focus }} />
                <span className="field-photo__caption">{p.caption}</span>
              </button>
            ))}
          </div>
        </div>

        <Lightbox item={open} onClose={closeLightbox} />
      </div>
    </section>
  )
}

export default FieldWork
