import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import Lightbox from './ui/lightbox'
import CountUp from './ui/count-up'
import './ResearchHighlight.css'

const DOI = 'https://doi.org/10.1016/j.renene.2025.123021'

const pipeline = [
  { tag: 'Input', title: 'Multivariate weather series', text: 'Temperature, humidity, wind speed and direction, and solar zenith angle, NSRDB 2005 to 2014' },
  { tag: 'NA-MEMD', title: 'Decompose', text: 'Noise-assisted multivariate EMD splits the series into 14 or 15 intrinsic mode functions per site' },
  { tag: 'FFT', title: 'Reduce', text: 'Dominant frequencies regroup the IMFs into 5 signals: three high, one medium, one low' },
  { tag: 'AM-LSTM', title: 'Forecast', text: 'An attention-based LSTM, tuned per signal, predicts each component' },
  { tag: 'Output', title: 'Recombine', text: 'Component forecasts sum to the 11 sunshine hours of the next day' },
]

// Table 5 of the paper: test-set RMSE (W/m²) per site.
const models = [
  { key: 'am', label: 'AM-LSTM', cls: 'rh-bar--base' },
  { key: 'nam', label: 'N-AM-LSTM', cls: 'rh-bar--mid' },
  { key: 'ours', label: 'N-FFT-AM-LSTM (this paper)', cls: 'rh-bar--ours' },
]
const sites = [
  { name: 'Jodhpur', zone: 'hot-dry', am: 91.22, nam: 69.22, ours: 67.52 },
  { name: 'Kamuthi', zone: 'warm-humid', am: 121.26, nam: 71.5, ours: 51.89 },
  { name: 'Chikkoppa', zone: 'warm-humid', am: 107.47, nam: 87.36, ours: 70.12 },
  { name: 'Charanka', zone: 'hot-dry', am: 88.49, nam: 63.87, ours: 62.38 },
]
const RMSE_AXIS = 130

const stats = [
  { value: '62.97', unit: 'W/m²', label: 'mean RMSE across the four sites (R = 0.972)' },
  { value: '36.9%', unit: '', label: 'lower RMSE than the attention-LSTM alone' },
  { value: '13%', unit: '', label: 'lower RMSE than decomposition without the FFT step' },
  { value: '58.8%', unit: '', label: 'less training time: 876 s instead of 2128 s, 5 models instead of 15' },
]

const figures = [
  { src: '/images/research/fft-lstm-methodology.webp', caption: 'Proposed methodology for day-ahead forecasting (Fig. 7)' },
  { src: '/images/research/fft-lstm-architecture.webp', caption: 'AM-LSTM network used for each signal (Fig. 13)' },
  { src: '/images/research/fft-lstm-monsoon-jodhpur.webp', caption: 'Monsoon days at Jodhpur: actual and forecast GHI, RMSE by model (Fig. 16a)' },
]

// Illustrative decomposition: a synthetic 3-day irradiance curve built from
// a smooth daily envelope, slow cloud modulation and fast fluctuations.
const W = 600
const N = 300
const xs = Array.from({ length: N }, (_, i) => i / (N - 1))
const bell = (x) => Math.max(0, Math.sin(Math.PI * ((x * 3) % 1))) ** 1.5
const low = xs.map(bell)
const medium = xs.map((x) => -0.28 * bell(x) * (0.5 + 0.5 * Math.sin(2 * Math.PI * x * 4.3 + 1)))
const high = xs.map((x) => 0.06 * bell(x) * (Math.sin(97 * x) + 0.6 * Math.sin(211 * x + 2)))
const total = xs.map((_, i) => low[i] + medium[i] + high[i])

function toPath(values, height, min, max) {
  return values
    .map((v, i) => {
      const x = (xs[i] * W).toFixed(1)
      const y = (height - ((v - min) / (max - min)) * height).toFixed(1)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
}

const decompRows = [
  { label: 'Measured GHI', path: toPath(total, 70, -0.05, 1.05), cls: 'rh-line--total', h: 70 },
  { label: 'Low', path: toPath(low, 40, 0, 1), cls: 'rh-line--low', h: 40 },
  { label: 'Medium', path: toPath(medium, 40, -0.3, 0), cls: 'rh-line--mid', h: 40 },
  { label: 'High', path: toPath(high, 40, -0.1, 0.1), cls: 'rh-line--high', h: 40 },
]

const ROW_GAP = 26
const rowsWithOffset = decompRows.map((r, i) => ({
  ...r,
  y: decompRows.slice(0, i).reduce((acc, prev) => acc + prev.h + ROW_GAP, 0),
}))
const DECOMP_H = rowsWithOffset.reduce((acc, r) => acc + r.h + ROW_GAP, 0)

function ResearchHighlight() {
  const [open, setOpen] = useState(null)
  const closeLightbox = () => setOpen(null)

  return (
    <section id="research" className="research day section">
      <div className="container">
        <div className="section-head">
          <p className="section-head__note">Research highlight, Renewable Energy (Elsevier), 2025</p>
          <h2 className="section-head__title">Day-ahead solar forecasting with an FFT-assisted LSTM</h2>
          <p className="section-head__lead">
            A hybrid deep-learning model for hourly day-ahead irradiance at four Indian sites in
            different climate zones. Decomposition handles the non-stationary weather signal, an FFT cuts
            the number of sub-models from up to 15 to 5, and an attention-based LSTM forecasts each part.
          </p>
        </div>

        <ol className="rh-pipeline">
          {pipeline.map((p, i) => (
            <li key={p.tag} className="rh-step">
              <span className="rh-step__tag">
                <span className="t-display rh-step__index">{i + 1}</span> {p.tag}
              </span>
              <h3 className="rh-step__title">{p.title}</h3>
              <p className="rh-step__text">{p.text}</p>
            </li>
          ))}
        </ol>

        <div className="rh-grid">
          <figure className="rh-card">
            <figcaption className="rh-card__title">How decomposition separates the signal</figcaption>
            <Motion.svg
              className="rh-decomp"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              viewBox={`-96 -6 ${W + 102} ${DECOMP_H}`}
              role="img"
              aria-label="Illustration: a three-day irradiance curve split into low, medium and high frequency components"
            >
              {rowsWithOffset.map((r, i) => (
                <g key={r.label} transform={`translate(0 ${r.y})`}>
                  <text x="-96" y={r.h / 2 + 4} className="rh-decomp__label">{r.label}</text>
                  <line x1="0" x2={W} y1={r.h} y2={r.h} className="rh-decomp__base" />
                  <Motion.path
                    d={r.path}
                    className={`rh-line ${r.cls}`}
                    variants={{
                      hidden: { pathLength: 0 },
                      show: { pathLength: 1, transition: { duration: 1.6, delay: i * 0.35, ease: 'easeInOut' } },
                    }}
                  />
                </g>
              ))}
            </Motion.svg>
            <p className="rh-card__note">Illustration with synthetic data. The paper’s real IMFs are in Figs. 8 to 11.</p>
          </figure>

          <figure className="rh-card">
            <figcaption className="rh-card__title">Test-set RMSE by site, W/m² (lower is better)</figcaption>
            <ul className="rh-legend">
              {models.map((m) => (
                <li key={m.key}><span className={`rh-swatch ${m.cls}`} />{m.label}</li>
              ))}
            </ul>
            <div className="rh-chart">
              {sites.map((s) => (
                <div key={s.name} className="rh-site">
                  <div className="rh-site__name">
                    {s.name}
                    <span>{s.zone}</span>
                  </div>
                  <div className="rh-site__bars">
                    {models.map((m) => (
                      <div key={m.key} className="rh-row" tabIndex={0}>
                        <span className={`rh-bar ${m.cls}`} style={{ width: `${(s[m.key] / RMSE_AXIS) * 100}%` }} />
                        {m.key === 'ours' && <span className="rh-row__value t-num">{s.ours}</span>}
                        <span className="rh-tip" role="tooltip">
                          {s.name}, {m.label}: <strong>{s[m.key]} W/m²</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="rh-card__note">Source: Table 5 of the paper. Random forest and plain LSTM baselines were higher still.</p>
          </figure>
        </div>

        <dl className="rh-stats">
          {stats.map((s) => (
            <div key={s.label} className="rh-stat">
              <dt className="rh-stat__value t-display"><CountUp value={s.value} />{s.unit && <small> {s.unit}</small>}</dt>
              <dd className="rh-stat__label">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="rh-figures">
          {figures.map((f) => (
            <button key={f.src} className="rh-figure" onClick={() => setOpen(f)}>
              <img src={f.src} alt={f.caption} loading="lazy" />
              <span>{f.caption}</span>
            </button>
          ))}
        </div>
        <p className="rh-credit">
          Figures from Rathore, Gupta, Sharma and Singh, <em>Renewable Energy</em> 247 (2025) 123021,
          © Elsevier, reproduced by the author.
        </p>

        <div className="rh-actions">
          <a className="btn btn--primary" href={DOI} target="_blank" rel="noopener noreferrer">
            Read the paper
          </a>
          <a className="btn" href="/projects/fft-lstm-solar-forecast/">
            Read the case study
          </a>
        </div>

        <div className="rh-patent">
          <button
            className="rh-patent__thumb"
            onClick={() => setOpen({ src: '/images/patent-certificate.webp', caption: 'Patent certificate, Indian Patent No. 580682' })}
            aria-label="View patent certificate"
          >
            <img src="/images/patent-certificate.webp" alt="Patent certificate" loading="lazy" />
          </button>
          <div>
            <p className="rh-patent__note">Indian patent granted on 16 February 2026</p>
            <h3 className="rh-patent__title">A System and Method for Forecasting Solar Photovoltaic Power Using Machine Learning</h3>
            <p className="rh-patent__meta">
              Patent No. 580682, application 202311059664 filed 5 September 2023. Patentee: iHUB
              DivyaSampark, IIT Roorkee. Inventors: Rhythm Singh, Raksha Sharma, Abhijeet Rathore and Priya Gupta.
            </p>
          </div>
        </div>

        <Lightbox item={open} onClose={closeLightbox} />
      </div>
    </section>
  )
}

export default ResearchHighlight
