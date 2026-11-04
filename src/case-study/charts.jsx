import { useState } from 'react'

const REF_LABELS = {
  kasten_czeplak: 'Cloud-cover formula (Kasten–Czeplak)',
  climatology: 'Climatology (typical day)',
  nwp_raw: 'Raw weather forecast',
  model: 'This model',
}
const REF_ORDER = ['kasten_czeplak', 'climatology', 'nwp_raw', 'model']

// Horizontal bars: RMSE of each reference for one group of sites.
export function BaselineBars({ title, rmse, n, max }) {
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        {title} <span>{n.toLocaleString()} hourly test points</span>
      </figcaption>
      <div className="cs-bars">
        {REF_ORDER.map((key) => (
          <div key={key} className={`cs-bars__row${key === 'model' ? ' is-model' : ''}`} tabIndex={0}>
            <span className="cs-bars__label">{REF_LABELS[key]}</span>
            <span className="cs-bars__track">
              <span className="cs-bars__fill" style={{ width: `${(rmse[key] / max) * 100}%` }} />
            </span>
            <span className="cs-bars__value">{Math.round(rmse[key])}</span>
          </div>
        ))}
      </div>
      <p className="cs-chart__note">Hourly RMSE, W/m², all of 2024. Lower is better.</p>
    </figure>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Line chart: monthly RMSE of the model vs the raw forecast, monsoon shaded.
export function MonthlyChart({ monthly }) {
  const [hover, setHover] = useState(null)
  const W = 720
  const H = 300
  const pad = { l: 44, r: 16, t: 16, b: 32 }
  const yMax = Math.ceil(Math.max(...monthly.map((m) => m.nwp_rmse)) / 20) * 20
  const x = (i) => pad.l + (i / (monthly.length - 1)) * (W - pad.l - pad.r)
  const y = (v) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b)
  const line = (key) => monthly.map((m, i) => `${i ? 'L' : 'M'}${x(i)},${y(m[key])}`).join(' ')
  const ticks = Array.from({ length: yMax / 40 + 1 }, (_, i) => i * 40)

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (monthly.length - 1))
    setHover(Math.max(0, Math.min(monthly.length - 1, i)))
  }

  const h = hover !== null ? monthly[hover] : null

  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        Error through the year <span>training sites, 2024</span>
      </figcaption>
      <ul className="cs-legend">
        <li><span className="cs-swatch cs-swatch--nwp" />Raw weather forecast</li>
        <li><span className="cs-swatch cs-swatch--model" />This model</li>
      </ul>
      <div className="cs-line-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="cs-line"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label="Monthly hourly RMSE of the model and the raw weather forecast; the gap is widest in the June to September monsoon."
        >
          <rect x={x(5) - 10} y={pad.t} width={x(8) - x(5) + 20} height={H - pad.t - pad.b} className="cs-line__monsoon" />
          <text x={(x(5) + x(8)) / 2} y={pad.t + 16} className="cs-line__monsoon-label">Monsoon</text>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="cs-line__grid" />
              <text x={pad.l - 8} y={y(t) + 4} className="cs-line__tick" textAnchor="end">{t}</text>
            </g>
          ))}
          {monthly.map((m, i) => (
            <text key={m.month} x={x(i)} y={H - 10} className="cs-line__tick" textAnchor="middle">{MONTHS[m.month - 1]}</text>
          ))}
          <path d={line('nwp_rmse')} className="cs-line__nwp" />
          <path d={line('model_rmse')} className="cs-line__model" />
          {monthly.map((m, i) => (
            <g key={`p${m.month}`}>
              <circle cx={x(i)} cy={y(m.nwp_rmse)} r="4" className="cs-line__dot cs-line__dot--nwp" />
              <circle cx={x(i)} cy={y(m.model_rmse)} r="4" className="cs-line__dot cs-line__dot--model" />
            </g>
          ))}
          {h && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="cs-line__cross" />}
        </svg>
        {h && (
          <div className="cs-tip cs-tip--float" style={{ left: `${(x(hover) / W) * 100}%` }}>
            <strong>{MONTHS[h.month - 1]}</strong>
            <span>Raw forecast {Math.round(h.nwp_rmse)} W/m²</span>
            <span>Model {Math.round(h.model_rmse)} W/m² ({Math.round((1 - h.model_rmse / h.nwp_rmse) * 100)}% lower)</span>
          </div>
        )}
      </div>
      <p className="cs-chart__note">Hourly RMSE, W/m². Hover for values.</p>
    </figure>
  )
}

// Diverging bars: skill against the raw forecast at every test site.
export function SiteSkill({ sites }) {
  const sorted = [...sites].sort((a, b) => b.skill_vs_nwp_raw - a.skill_vs_nwp_raw)
  const lo = Math.min(-0.2, ...sorted.map((s) => s.skill_vs_nwp_raw))
  const hi = Math.max(0.4, ...sorted.map((s) => s.skill_vs_nwp_raw))
  const zero = (-lo / (hi - lo)) * 100

  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        Skill at every test site <span>{sorted.length} sites · 1 − RMSE<sub>model</sub> / RMSE<sub>raw forecast</sub></span>
      </figcaption>
      <ul className="cs-legend">
        <li><span className="cs-swatch cs-swatch--model" />Training site (2024 unseen)</li>
        <li><span className="cs-swatch cs-swatch--holdout" />Never seen in training</li>
        <li><span className="cs-swatch cs-swatch--worse" />Worse than raw forecast</li>
      </ul>
      <ol className="cs-skill">
        {sorted.map((s) => {
          const v = s.skill_vs_nwp_raw
          const left = v >= 0 ? zero : zero + (v / (hi - lo)) * 100
          const width = (Math.abs(v) / (hi - lo)) * 100
          const cls = [s.holdout && 'is-holdout', v < 0 && 'is-worse'].filter(Boolean).join(' ')
          return (
            <li key={s.site} className={`cs-skill__row ${cls}`} tabIndex={0}>
              <span className="cs-skill__name">{s.site}</span>
              <span className="cs-skill__track">
                <span className="cs-skill__zero" style={{ left: `${zero}%` }} />
                <span className="cs-skill__bar" style={{ left: `${left}%`, width: `${width}%` }} />
              </span>
              <span className="cs-skill__value">{v > 0 ? '+' : ''}{Math.round(v * 100)}%</span>
              <span className="cs-tip" role="tooltip">
                {s.site}{s.holdout ? ' (never seen)' : ''}: model {Math.round(s.model.rmse)} vs raw {Math.round(s.nwp_raw.rmse)} W/m²
              </span>
            </li>
          )
        })}
      </ol>
    </figure>
  )
}

const FEATURE_LABELS = {
  kt_nwp: 'Forecast clear-sky index',
  cloud: 'Total cloud cover',
  rh: 'Relative humidity',
  cloud_low: 'Low cloud',
  lat: 'Latitude',
  cloud_mid: 'Mid cloud',
  ghi_cs: 'Clear-sky irradiance',
  temp: 'Temperature',
  cloud_high: 'High cloud',
  doy_sin: 'Season (sin)',
  lon: 'Longitude',
  cos_zenith: 'Sun height',
  doy_cos: 'Season (cos)',
  elevation: 'Elevation',
}

export function FeatureImportance({ importance, top = 8 }) {
  const rows = Object.entries(importance).sort((a, b) => b[1] - a[1]).slice(0, top)
  const max = rows[0][1]
  return (
    <figure className="cs-chart">
      <figcaption className="cs-chart__title">
        What the model leans on <span>LightGBM feature importance, top {top}</span>
      </figcaption>
      <div className="cs-bars">
        {rows.map(([k, v], i) => (
          <div key={k} className={`cs-bars__row${i === 0 ? ' is-model' : ''}`} tabIndex={0}>
            <span className="cs-bars__label">{FEATURE_LABELS[k] || k}</span>
            <span className="cs-bars__track">
              <span className="cs-bars__fill" style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <span className="cs-bars__value">{Math.round(v * 100)}%</span>
          </div>
        ))}
      </div>
      <p className="cs-chart__note">
        The forecast’s own clear-sky index carries most of the signal; cloud layers, humidity and
        location refine the correction.
      </p>
    </figure>
  )
}
