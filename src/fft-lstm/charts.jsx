import { useState } from 'react'
import { MODELS, SITES, SEASONS, SEASONAL_RMSE, OVERALL, TRAIN_TIME_S, LITERATURE, GROUPS } from './data'

const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, ''))

function Legend() {
  return (
    <ul className="cs-legend">
      {MODELS.map((m) => (
        <li key={m.key}><span className={`fl-swatch fl-m--${m.key}`} />{m.label}</li>
      ))}
    </ul>
  )
}

// Five bars per site, one per model. `values` is { site: { modelKey: number } }.
function GroupedBars({ values, unit, max }) {
  return (
    <div className="fl-groups">
      {SITES.map((s) => {
        const row = values[s.name]
        const best = Math.min(...MODELS.map((m) => row[m.key]))
        return (
          <div key={s.name} className="fl-group">
            <div className="fl-group__name">{s.name}<span>{s.climate}</span></div>
            <div className="fl-group__bars">
              {MODELS.map((m) => (
                <div key={m.key} className={`fl-bar${row[m.key] === best ? ' is-best' : ''}`} tabIndex={0}>
                  <span className="fl-bar__track">
                    <span className={`fl-bar__fill fl-m--${m.key}`} style={{ width: `${(row[m.key] / max) * 100}%` }} />
                  </span>
                  <span className="fl-bar__value">{fmt(row[m.key])}</span>
                  <span className="cs-tip fl-bar__tip" role="tooltip">{s.name}, {m.label}: <strong>{fmt(row[m.key])} {unit}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const METRICS = [
  { key: 'rmse', label: 'RMSE', unit: 'W/m²', max: 130 },
  { key: 'nrmse', label: 'nRMSE', unit: '%', max: 13 },
]

export function OverallChart() {
  const [metric, setMetric] = useState(METRICS[0])
  const values = Object.fromEntries(SITES.map((s) => [s.name, OVERALL[s.name][metric.key]]))
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        Test-set error by site <span>{metric.label} in {metric.unit}, lower is better. Table 5</span>
      </figcaption>
      <div className="fl-tabs" role="tablist" aria-label="Metric">
        {METRICS.map((m) => (
          <button key={m.key} role="tab" aria-selected={m.key === metric.key} className="fl-tab" onClick={() => setMetric(m)}>
            {m.label}
          </button>
        ))}
      </div>
      <Legend />
      <GroupedBars values={values} unit={metric.unit} max={metric.max} />
      <p className="cs-chart__note">The best value per site is in bold. Hover or tab to a bar for its value.</p>
    </figure>
  )
}

export function SeasonChart() {
  const [season, setSeason] = useState(SEASONS[1])
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        Error by season <span>RMSE in W/m², test set. Table 7</span>
      </figcaption>
      <div className="fl-tabs" role="tablist" aria-label="Season">
        {SEASONS.map((s) => (
          <button key={s.key} role="tab" aria-selected={s.key === season.key} className="fl-tab" onClick={() => setSeason(s)}>
            {s.label} <small>{s.months}</small>
          </button>
        ))}
      </div>
      <Legend />
      <GroupedBars values={SEASONAL_RMSE[season.key]} unit="W/m²" max={150} />
      <p className="cs-chart__note">Seasons follow the India Meteorological Department’s classification.</p>
    </figure>
  )
}

export function RuntimeChart() {
  const max = Math.max(...Object.values(TRAIN_TIME_S))
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        Training time <span>mean across the four sites, seconds. Section 4.3</span>
      </figcaption>
      <div className="cs-bars">
        {MODELS.map((m) => (
          <div key={m.key} className={`cs-bars__row${m.key === 'ours' ? ' is-model' : ''}`}>
            <span className="cs-bars__label">{m.label}</span>
            <span className="cs-bars__track">
              <span className="cs-bars__fill" style={{ width: `${(TRAIN_TIME_S[m.key] / max) * 100}%` }} />
            </span>
            <span className="cs-bars__value fl-wide">{TRAIN_TIME_S[m.key]}</span>
          </div>
        ))}
      </div>
      <p className="cs-chart__note">
        N-AM-LSTM trains one network per IMF (15); the FFT step cuts that to 5, a 58.8% shorter
        run. Both also spend 398 s decomposing each half of the data.
      </p>
    </figure>
  )
}

export function LiteratureChart() {
  const max = 90
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        Against earlier work <span>hourly day-ahead GHI, RMSE in W/m². Table 6</span>
      </figcaption>
      <div className="cs-bars">
        {LITERATURE.map((l) => (
          <div key={l.ref} className={`cs-bars__row fl-lit${l.ours ? ' is-model' : ''}`}>
            <span className="cs-bars__label">{l.algo}<small>{l.ref}, {l.where}</small></span>
            <span className="cs-bars__track">
              <span className="cs-bars__fill" style={{ width: `${(l.rmse / max) * 100}%` }} />
            </span>
            <span className="cs-bars__value fl-wide">{l.rmse}{l.min ? '*' : ''}</span>
          </div>
        ))}
      </div>
      <p className="cs-chart__note">* Best site of a multi-site study. Different sites and years, so only a rough guide.</p>
    </figure>
  )
}

export function FrequencyGroups() {
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        15 IMFs become 5 signals <span>Kamuthi: dominant frequency of each IMF (Table 2) and the cut-offs used (Table 3)</span>
      </figcaption>
      <ol className="fl-freq">
        {GROUPS.map((g) => (
          <li key={g.name} className="fl-freq__group">
            <div className="fl-freq__head">
              <strong>{g.name}</strong>
              <span>{g.range}</span>
            </div>
            <ul className="fl-freq__imfs">
              {g.imfs.map(([name, f]) => (
                <li key={name}><span>{name}</span><code>{f}</code></li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="cs-chart__note">
        The high-frequency part is the hardest to predict, so it is split three ways; slow modes and
        the residual are pooled into one LOW signal.
      </p>
    </figure>
  )
}
