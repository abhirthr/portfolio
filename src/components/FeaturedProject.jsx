import BrowserFrame from './ui/browser-frame'
import './FeaturedProject.css'

const steps = [
  {
    title: 'ML-corrected weather forecasts',
    text: 'One India-wide LightGBM model corrects NWP irradiance by learning the clear-sky index from archived forecasts paired with satellite-derived irradiance (NASA POWER).',
  },
  {
    title: 'Satellite-corrected first hours',
    text: 'Every hour, the newest Meteosat-derived reading at the point is compared with what the model expected, and the next few hours are nudged towards it, fading over about 5 hours. Weather models are weakest in the first hours; satellite pictures are strongest there.',
  },
  {
    title: 'Temperature bias correction',
    text: 'IMD gridded temperature corrects the forecast bias that feeds PV cell temperature and air density.',
  },
  {
    title: 'Physics from weather to power',
    text: 'pvlib clear-sky and PV modelling, hub-height wind extrapolation with hourly shear, and a turbine power curve.',
  },
  {
    title: 'From energy to rupees',
    text: 'Deviation charges under Indian scheduling rules, and project NPV, IRR, LCOE and payback from the long-term yield, with sourced defaults and a step-by-step "show calculation" view.',
  },
]

const stack = 'Python, LightGBM, pvlib, pandas, FastAPI, React, Leaflet, Render, Vercel and GitHub Actions'

const RMSE_MAX = 110
const rmse = [
  { label: 'Raw weather forecast', value: 101, cls: 'fp-bar__fill--raw' },
  { label: 'ML-corrected', value: 78, cls: 'fp-bar__fill--model' },
]

function FeaturedProject() {
  return (
    <section id="featured" className="featured night section">
      <div className="container">
        <div className="section-head">
          <p className="section-head__note">Featured project, January to March 2026</p>
          <h2 className="section-head__title">India Renewables Forecast</h2>
          <p className="section-head__lead">
            A forecasting platform that gives a solar and wind baseline for any location in India.
            Click a point on the map to get a 7-day generation forecast for your plant, with the first hours
            corrected by the latest satellite picture, alongside the long-term yield and project financials
            for that site.
          </p>
        </div>

        <div className="featured__grid">
          <div className="featured__main">
            <h3 className="featured__sub">How it works</h3>
            <ol className="featured__steps">
              {steps.map((s, i) => (
                <li key={s.title} className="featured__step">
                  <span className="featured__step-num t-display">{i + 1}</span>
                  <div>
                    <h4 className="featured__step-title">{s.title}</h4>
                    <p className="featured__step-text">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="featured__stack">
              <span>Built with</span> {stack}.
            </p>

            <div className="featured__actions">
              <a className="btn btn--primary" href="https://app.abhijeetrathore.in" target="_blank" rel="noopener noreferrer">
                Open the live app
              </a>
              <a className="btn" href="/projects/india-renewables-forecast/">
                Read the case study
              </a>
            </div>
          </div>

          <aside className="featured__results">
            <h3 className="featured__sub">Results</h3>
            <p className="featured__results-note">Trained on 2022 to 2023, tested on all of 2024.</p>

            <div className="fp-chart">
              <p className="fp-chart__title">Hourly irradiance error at training sites</p>
              {rmse.map((r) => (
                <div key={r.label} className="fp-bar">
                  <div className="fp-bar__head">
                    <span>{r.label}</span>
                    <span className="fp-bar__value t-num">{r.value} W/m²</span>
                  </div>
                  <div className="fp-bar__track">
                    <div className={`fp-bar__fill ${r.cls}`} style={{ width: `${(r.value / RMSE_MAX) * 100}%` }} />
                  </div>
                </div>
              ))}
              <p className="fp-chart__note">RMSE, lower is better. A similar gain holds through the monsoon.</p>
            </div>

            <dl className="fp-stats">
              <div className="fp-stat">
                <dt className="fp-stat__value t-display">23%</dt>
                <dd className="fp-stat__label">lower error than the raw forecast at training sites</dd>
              </div>
              <div className="fp-stat">
                <dt className="fp-stat__value t-display">10%</dt>
                <dd className="fp-stat__label">lower at 8 sites held out of training entirely</dd>
              </div>
              <div className="fp-stat">
                <dt className="fp-stat__value t-display">3.2%</dt>
                <dd className="fp-stat__label">further cut in the first live hour from the satellite correction, at held-out sites</dd>
              </div>
            </dl>

            <p className="featured__honest">
              The app shows where the model struggles, such as high-altitude Leh, instead of hiding it.
            </p>
          </aside>
        </div>

        <figure className="featured__shot">
          <a href="https://app.abhijeetrathore.in" target="_blank" rel="noopener noreferrer" className="featured__shot-link">
            <BrowserFrame
              url="app.abhijeetrathore.in"
              images={['/images/app/forecast-map.webp', '/images/app/forecast-results.webp', '/images/app/forecast-finance.webp']}
              ratio={1440 / 900}
              label="Screenshots of the India Renewables Forecast app: the India map with the 32 test sites coloured by model skill, a 7-day forecast for a 50 MW plant at Roorkee, and the project financials for the same plant at Jodhpur, Rajasthan, worked step by step"
            />
          </a>
          <figcaption className="featured__shot-caption">
            The live app: click anywhere in India for a forecast. Coloured dots are the 32 test sites, shaded by
            how much the model beats the raw weather forecast. Then a 7-day forecast for a 50 MW plant at Roorkee, and
            the working behind the same plant's project financials at Jodhpur, Rajasthan.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export default FeaturedProject
