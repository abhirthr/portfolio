import snapshot from '../data/irf-results.json'
import satSnapshot from '../data/irf-sat-nowcast.json'
import SatNowcast from './SatNowcast'
import { useLiveResults } from '../lib/useLiveResults'
import BrowserFrame from '../components/ui/browser-frame'
import Footer from '../components/Footer'
import Section from './Section'
import { BaselineBars, MonthlyChart, SiteSkill, FeatureImportance } from './charts'
import './CaseStudy.css'
import Logo from '../components/Logo'

const APP_URL = 'https://app.abhijeetrathore.in'
const RESULTS_URL = `${APP_URL}/data/model_results.json`
const SAT_URL = `${APP_URL}/data/sat_nowcast.json`
const isSat = (d) => Array.isArray(d?.leads) && d.leads.length > 0 && Number.isFinite(d.a)

const pct = (v) => `${Math.round(v * 100)}%`
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function CaseStudy() {
  const { data: r, live } = useLiveResults(RESULTS_URL, snapshot)
  const { data: sat } = useLiveResults(SAT_URL, satSnapshot, isSat)
  const { seen, unseen, monsoon } = r.headline
  const maxRmse = Math.max(seen.rmse.kasten_czeplak, unseen.rmse.kasten_czeplak)
  const holdout = r.per_site.filter((s) => s.holdout)
  const beatCount = r.per_site.filter((s) => s.skill_vs_nwp_raw > 0).length
  const worst = [...r.per_site].sort((a, b) => a.skill_vs_nwp_raw - b.skill_vs_nwp_raw)[0]

  return (
    <>
      <header className="cs-top">
        <a href="/#featured" className="cs-top__back">Back to portfolio</a>
        <a href="/" className="cs-top__logo" aria-label="Home">
          <Logo />
        </a>
      </header>

      <main>
        <section className="cs-hero night">
        <div className="container">
          <p className="cs-eyebrow">Case study, January to March 2026</p>
          <h1 className="cs-hero__title">India Renewables Forecast</h1>
          <p className="cs-hero__lead">
            Weather models forecast sunshine well on clear days but carry systematic errors under haze,
            fog and monsoon cloud. This project trains one model on {r.n_train_sites} sites to learn
            those errors from satellite data, then corrects the forecast anywhere in India, and turns it
            into solar and wind power. For the first few hours, the latest satellite picture corrects it
            further.
          </p>
          <div className="cs-hero__actions">
            <a className="btn btn--primary" href={APP_URL} target="_blank" rel="noopener noreferrer">
              Open the live app
            </a>
            <a className="btn" href="#results">Jump to results</a>
          </div>

          <dl className="cs-meta">
            <div><dt>Role</dt><dd>Built end to end: data, model, API and web app</dd></div>
            <div><dt>Model</dt><dd>LightGBM on the clear-sky index, with P10 / P90 quantile models</dd></div>
            <div><dt>Data</dt><dd>Open-Meteo forecasts, NASA POWER and Meteosat-derived satellite irradiance, IMD gridded temperature</dd></div>
            <div><dt>Stack</dt><dd>Python, pvlib, pandas, FastAPI, React, Leaflet, Render, Vercel, GitHub Actions</dd></div>
          </dl>

        <div className="cs-kpis">
          <div className="cs-kpi"><span className="cs-kpi__value t-display">−{pct(seen.skill_vs_nwp_raw)}</span><span className="cs-kpi__label">hourly error vs the raw forecast at training sites ({Math.round(seen.rmse.nwp_raw)} → {Math.round(seen.rmse.model)} W/m²)</span></div>
          <div className="cs-kpi"><span className="cs-kpi__value t-display">−{pct(monsoon.skill_vs_nwp_raw)}</span><span className="cs-kpi__label">during the monsoon, June–September ({Math.round(monsoon.rmse.nwp_raw)} → {Math.round(monsoon.rmse.model)} W/m²)</span></div>
          <div className="cs-kpi"><span className="cs-kpi__value t-display">−{pct(unseen.skill_vs_nwp_raw)}</span><span className="cs-kpi__label">at {holdout.length} sites never used in training ({Math.round(unseen.rmse.nwp_raw)} → {Math.round(unseen.rmse.model)} W/m²)</span></div>
          <div className="cs-kpi"><span className="cs-kpi__value t-display">{beatCount}/{r.per_site.length}</span><span className="cs-kpi__label">test sites where the model beats the raw forecast</span></div>
        </div>
        </div>
        </section>

        <div className="cs-body day">
        <div className="container">
        <Section num="01" title="The problem">
          <p>
            Grid operators and plant developers need a day-ahead view of solar and wind output for any
            location, not just the few with ground instruments. Free numerical weather prediction (NWP)
            gives a forecast everywhere, but in India its irradiance is biased: it misses the dimming
            from haze and dust, and it struggles with monsoon cloud. Ground stations that could correct
            it are sparse and mostly private.
          </p>
        </Section>

        <Section num="02" title="The key idea: learn the correction, not the sun">
          <div className="cs-idea">
            <div className="cs-formula" aria-label="k t star equals G H I divided by clear-sky G H I">
              <span>k<sub>t</sub>* =</span>
              <span className="cs-frac"><span>GHI</span><span>GHI<sub>clear-sky</sub></span></span>
            </div>
            <p>
              Instead of predicting irradiance directly, the model predicts the <strong>clear-sky
              index</strong>: how much of the clear-sky sunlight actually reaches the ground. Sun
              geometry is handled exactly by physics (pvlib), so the model only has to learn the
              weather-dependent part, which transfers across latitudes and seasons.
            </p>
            <p>
              Satellite irradiance (NASA POWER) <strong>trains</strong> the model. At forecast time it
              needs only the weather forecast and the sun’s position, so it runs anywhere in India, for
              free. For the first few hours, the latest satellite reading corrects it further
              (<a href="#satellite">section 06</a>).
            </p>
          </div>
        </Section>

        <Section num="03" title="Pipeline">
          <div className="cs-pipe">
            <p className="cs-pipe__label">Offline, once</p>
            <ol className="cs-pipe__row">
              <li><strong>Archived weather forecasts</strong><span>Open-Meteo historical runs, 2022–2024</span></li>
              <li><strong>Satellite irradiance</strong><span>NASA POWER hourly GHI: the truth it learns</span></li>
              <li><strong>IMD gridded temperature</strong><span>Monthly forecast temperature bias per cell</span></li>
              <li className="is-key"><strong>Train &amp; freeze</strong><span>LightGBM on k<sub>t</sub>*, plus P10 / P90 models</span></li>
            </ol>
            <p className="cs-pipe__label">Every request</p>
            <ol className="cs-pipe__row">
              <li><strong>Live weather forecast</strong><span>Cloud layers, temperature, humidity, winds at 10 m and 100 m</span></li>
              <li><strong>Sun geometry</strong><span>pvlib solar position and Ineichen clear-sky</span></li>
              <li className="is-key"><strong>Frozen model</strong><span>Corrected irradiance with an 80% band</span></li>
              <li className="is-key"><strong>Latest satellite reading</strong><span>Meteosat-derived, about 2 h old: nudges the first hours</span></li>
              <li><strong>Power</strong><span>PV: cell temperature and losses · Wind: hub-height shear, air density, power curve</span></li>
            </ol>
          </div>
        </Section>

        <Section num="04" title="How it was tested">
          <ul className="cs-list">
            <li><strong>Chronological split.</strong> Trained on {r.train_period[0].slice(0, 4)}–{r.train_period[1].slice(0, 4)}, scored on all of {r.test_period[0].slice(0, 4)}, a year the model never saw.</li>
            <li><strong>Never-seen sites.</strong> {holdout.length} of the {r.per_site.length} sites were left out of training entirely: {holdout.map((s) => s.site.replace(/ \(.*\)/, '')).join(', ')}.</li>
            <li><strong>Three references.</strong> The raw weather forecast, a climatology (typical day for that site and month), and a classic cloud-cover formula.</li>
            <li><strong>One metric.</strong> Skill = 1 − RMSE<sub>model</sub> / RMSE<sub>reference</sub>. Positive means better than the reference.</li>
          </ul>
        </Section>

        <Section num="05" title="Results" id="results">
          <div className="cs-grid-2">
            <BaselineBars title="Training sites" rmse={seen.rmse} n={seen.n} max={maxRmse} />
            <BaselineBars title="Never-seen sites" rmse={unseen.rmse} n={unseen.n} max={maxRmse} />
          </div>
          <MonthlyChart monthly={r.monthly_seen} />
          <div className="cs-grid-2 cs-grid-2--wide-left">
            <SiteSkill sites={r.per_site} />
            <div className="cs-stack">
              <FeatureImportance importance={r.feature_importance} />
              <figure className="cs-chart">
                <figcaption className="cs-chart__title">Uncertainty band <span>target: 80% of real values inside</span></figcaption>
                <div className="cs-coverage">
                  <div><span className="cs-coverage__value t-display">{pct(r.interval_80.seen_sites.coverage)}</span><span>training sites, ±{Math.round(r.interval_80.seen_sites.mean_width_wm2 / 2)} W/m² average half-width</span></div>
                  <div><span className="cs-coverage__value t-display">{pct(r.interval_80.unseen_sites.coverage)}</span><span>never-seen sites, slightly too narrow away from the training data</span></div>
                </div>
              </figure>
            </div>
          </div>
          <p className="cs-data-note">
            {live ? 'Numbers load live from the app’s published results' : 'Numbers from the app’s published results'}{' '}
            (model trained {fmtDate(r.trained_at)}).
          </p>
        </Section>

        <Section num="06" title="Satellite pictures fix the first hours" id="satellite">
          <SatNowcast d={sat} />
        </Section>

        <Section num="07" title="From energy to rupees">
          <ul className="cs-list">
            <li><strong>Deviation charges.</strong> Indian plants pay when output strays from the schedule they filed. Replaying 2024 at every test site under the GERC 2019 charge bands, scheduling on the model instead of the raw forecast cuts those charges by about 42% on average.</li>
            <li><strong>Project financials.</strong> NPV, project IRR, LCOE and payback for the plant you describe, on its own P50 and P90 yield. Defaults come from Indian regulators and auctions (KERC tariff orders, SECI tariffs, CERC norms), each cited and editable. Pre-tax, without debt.</li>
            <li><strong>Show the working.</strong> Both cards open a step-by-step calculation with the plant’s own numbers, so every rupee can be traced.</li>
          </ul>
        </Section>

        <Section num="08" title="Where it falls short">
          <ul className="cs-list">
            <li><strong>High altitude.</strong> {worst.site} is the worst site ({Math.round(worst.model.rmse)} W/m², {pct(Math.abs(worst.skill_vs_nwp_raw))} worse than the raw forecast): no training site is above ~900 m. The app warns above 1,500 m.</li>
            <li><strong>Islands.</strong> Port Blair gains nothing; the training set has no island climate.</li>
            <li><strong>Bias away from training data.</strong> At never-seen sites the model over-forecasts by {Math.round(unseen.mbe_model)} W/m² on average, against {Math.round(seen.mbe_model)} W/m² at training sites.</li>
            <li><strong>“Truth” is satellite-derived.</strong> NASA POWER is a ~1° product, not a pyranometer; ground stations are the next validation step.</li>
            <li><strong>Wind is physics-only.</strong> Hub-height extrapolation and a generic power curve, without a learned correction yet.</li>
            <li><strong>The satellite gain is modest.</strong> About 3% in the first live hour, gone by 8 hours, and it adds a little upward bias on top of the model’s own.</li>
          </ul>
          <p className="cs-aside">
            The app shows these weak spots on its own map instead of hiding them: every test site is
            coloured by its skill, red where the model loses.
          </p>
        </Section>

        <Section num="09" title="Engineering notes">
          <ul className="cs-list">
            <li><strong>One feature builder for training and serving,</strong> so the live API computes inputs exactly the way the model saw them in training.</li>
            <li><strong>A +1 hour alignment lag</strong> between NASA POWER and Open-Meteo hourly irradiance, found empirically by scanning lags against the data.</li>
            <li><strong>Quota-aware data access.</strong> Archive APIs share a daily per-IP limit, so every request goes through a retrying, disk-cached client and nothing is fetched twice.</li>
            <li><strong>Free-tier hosting.</strong> The FastAPI backend sleeps after 15 minutes on Render’s free plan; the app tells users when it is waking up instead of failing silently.</li>
            <li><strong>Offline tests in CI.</strong> Backend and shared-core tests run without network access on every push.</li>
          </ul>
        </Section>

        <figure className="cs-shot">
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="cs-shot__link">
            <BrowserFrame
              url="app.abhijeetrathore.in"
              images={['/images/app/forecast-map.webp', '/images/app/forecast-results.webp', '/images/app/forecast-finance.webp']}
              ratio={1440 / 900}
              label="Screenshots of the live app: the India map, a 7-day forecast for a 50 MW plant at Roorkee, and its project financials worked step by step"
            />
          </a>
          <figcaption>Try it: click anywhere in India for a 7-day forecast of your plant.</figcaption>
        </figure>

        <div className="cs-end">
          <a className="btn btn--primary" href={APP_URL} target="_blank" rel="noopener noreferrer">
            Open the live app
          </a>
          <a className="btn" href="/#featured">Back to portfolio</a>
        </div>
        </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CaseStudy
