import { useEffect, useRef, useState } from 'react'
import { INDIA_CELLS } from '../data/indiaCells'

// The satellite-corrected first hours, shown rather than told (adapted from the app's landing
// page, SatStory.jsx). Clouds drawn in the dot style drift over India, a Meteosat scan sweeps
// down, and at a cloudy point the reading pulls the forecast curve down. The curve is an
// illustration, but its correction uses the fitted weight and decay from the app's results.

const LON0 = 67.5, LON1 = 97.5, LAT0 = 7.5, LAT1 = 37.5
const STEP = 16
const MW = (LON1 - LON0) * STEP + STEP
const MH = (LAT1 - LAT0) * STEP + STEP
const mx = (lon) => (lon - LON0) * STEP + STEP / 2
const my = (lat) => (LAT1 - lat) * STEP + STEP / 2
const CELLS = [...INDIA_CELLS].map((k) => k.split(',').map(Number))
const TARGET = [29.5, 77.5] // Roorkee's cell

const CW = 340, CH = 180, PAD = { l: 20, r: 20, t: 14, b: 22 }
const H0 = 6, H1 = 18, L = 10, YMAX = 1000
const cx = (h) => PAD.l + ((h - H0) / (H1 - H0)) * (CW - PAD.l - PAD.r)
const cy = (ghi) => CH - PAD.b - (Math.min(ghi, YMAX) / YMAX) * (CH - PAD.t - PAD.b)
const clearSky = (h) => (h <= H0 || h >= H1 ? 0 : 1000 * Math.sin((Math.PI * (h - H0)) / (H1 - H0)) ** 1.15)
const ktModel = (h) => 0.84 + 0.05 * Math.sin(1.9 * h + 0.6) + 0.03 * Math.sin(3.7 * h + 2)
const ktActual = (h) => 0.86 - 0.5 * Math.exp(-(((h - 10.4) / 2.1) ** 2)) + 0.05 * Math.sin(5.3 * h) + 0.035 * Math.sin(8.9 * h + 1)

function curves(a, tau) {
  const r = ktActual(L) - ktModel(L)
  const w = (k) => (k < 1 ? a * k : k > 8 ? 0 : a * Math.exp(-(k - 1) / tau))
  const model = [], corrected = [], actual = [], modelAfter = []
  for (let h = H0; h <= H1 + 1e-9; h += 0.125) {
    const cs = clearSky(h)
    model.push([cx(h), cy(cs * ktModel(h))])
    actual.push([cx(h), cy(cs * ktActual(h))])
    if (h >= L) {
      corrected.push([cx(h), cy(cs * (ktModel(h) + w(h - L) * r))])
      modelAfter.push([cx(h), cy(cs * ktModel(h))])
    }
  }
  const d = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
  const corrY = (h) => cy(clearSky(h) * (ktModel(h) + w(h - L) * r))
  return { model: d(model), corrected: d(corrected), actual: d(actual), fill: `${d(corrected)}${d(modelAfter.reverse()).replace('M', 'L')}Z`, corrY }
}

const CLOUDS = [
  { x: mx(77.6), y: my(29.6), ax: 10, ay: 6, sp: 0.21, ph: 0, blobs: [[0, 0, 56, 36], [42, -16, 36, 24], [-36, 14, 34, 22], [12, 32, 32, 18]] },
  { x: mx(86), y: my(21), ax: 30, ay: 10, sp: 0.13, ph: 1.7, blobs: [[0, 0, 72, 32], [-60, 18, 44, 22], [54, -12, 48, 24], [10, 30, 36, 18]] },
  { x: mx(76.5), y: my(11.5), ax: 18, ay: 14, sp: 0.17, ph: 3.1, blobs: [[0, 0, 42, 26], [30, 16, 30, 20], [-26, -14, 28, 18]] },
  { x: mx(72), y: my(23), ax: 26, ay: 8, sp: 0.11, ph: 4.4, blobs: [[0, 0, 38, 16], [-30, 8, 26, 12], [30, 6, 24, 12]] },
]
const AMBER = [245, 165, 36], WHITE = [232, 237, 245]

function cloudAt(x, y, t) {
  let v = 0
  for (const c of CLOUDS) {
    const ox = c.x + c.ax * Math.sin(t * c.sp + c.ph)
    const oy = c.y + c.ay * Math.cos(t * c.sp * 0.8 + c.ph)
    c.blobs.forEach(([dx, dy, rx, ry], i) => {
      const breathe = 1 + 0.12 * Math.sin(t * 0.5 + i * 1.3 + c.ph)
      const u = (x - ox - dx) / (rx * breathe), q = (y - oy - dy) / (ry * breathe)
      v += Math.exp(-(u * u + q * q))
    })
  }
  const k = Math.min(1, Math.max(0, (v - 0.25) / 0.5))
  return k * k * (3 - 2 * k)
}

function paintDots(nodes, t) {
  nodes.forEach((el, i) => {
    if (!el) return
    const [lat, lon] = CELLS[i]
    const c = cloudAt(mx(lon), my(lat), t)
    el.setAttribute('fill', `rgb(${AMBER.map((v, j) => Math.round(v + (WHITE[j] - v) * c))})`)
    el.setAttribute('opacity', (0.45 + 0.45 * c).toFixed(2))
    el.setAttribute('r', (3.3 + 1.1 * c).toFixed(2))
  })
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function CloudDots({ active }) {
  const nodes = useRef([])
  useEffect(() => {
    paintDots(nodes.current, 0)
    if (!active || reducedMotion()) return
    let raf
    let last = 0
    const t0 = performance.now()
    const tick = (now) => {
      if (now - last > 40) { paintDots(nodes.current, (now - t0) / 1000); last = now }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return CELLS.map(([lat, lon], i) => (
    <circle key={`${lat},${lon}`} ref={(el) => { nodes.current[i] = el }} cx={mx(lon)} cy={my(lat)} r="3.3" fill="var(--sun)" opacity="0.45" />
  ))
}

function useInView(ref) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') return // no observer: the still picture is shown
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setSeen(true); io.disconnect() } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen])
  return seen
}

export default function SatNowcast({ d }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const { model, corrected, actual, fill, corrY } = curves(d.a, d.tau_h)
  const satY = cy(clearSky(L) * ktActual(L))
  const modelY = cy(clearSky(L) * ktModel(L))
  const live = d.leads.find((l) => l.lead_h === d.live_latency_h) ?? d.leads[0]
  const p = (x) => `−${(x * 100).toFixed(1)}%`
  return (
    <div ref={ref} className={`cs-sat night ${seen ? 'is-seen' : ''}`}>
      <figure className="cs-sat__anim" aria-label="Animation: a satellite scan passes over India; at a cloudy point the reading pulls the next hours of the forecast down, less with each hour">
        <svg className="cs-sat__map" viewBox={`0 0 ${MW} ${MH}`} aria-hidden="true">
          <defs>
            <linearGradient id="cs-sat-trail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0.28" />
            </linearGradient>
          </defs>
          <CloudDots active={seen} />
          <g className="cs-sat__scan">
            <rect x="0" y="-48" width={MW} height="48" fill="url(#cs-sat-trail)" />
            <rect x="0" y="-2" width={MW} height="2" fill="var(--sun)" />
          </g>
          <g className="cs-sat__target">
            <circle cx={mx(TARGET[1])} cy={my(TARGET[0])} r="10" fill="none" stroke="var(--sun)" strokeWidth="2.2" />
            <circle cx={mx(TARGET[1])} cy={my(TARGET[0])} r="2.6" fill="var(--sun)" />
          </g>
        </svg>
        <svg className="cs-sat__chart" viewBox={`0 0 ${CW} ${CH}`} aria-hidden="true">
          <line x1={PAD.l} x2={CW - PAD.r} y1={CH - PAD.b} y2={CH - PAD.b} stroke="var(--line-dark)" />
          {[6, 9, 12, 15, 18].map((h) => (
            <text key={h} x={cx(h)} y={CH - 6} textAnchor="middle" className="cs-sat__tick">{String(h).padStart(2, '0')}:00</text>
          ))}
          <path d={actual} fill="none" stroke="var(--snow)" strokeOpacity="0.22" strokeWidth="1.2" />
          <path d={model} fill="none" stroke="var(--snow-3)" strokeWidth="1.6" strokeDasharray="4 4" />
          <path className="cs-sat__fill" d={fill} fill="var(--sun)" fillOpacity="0.16" />
          <line className="cs-sat__gap" x1={cx(L)} x2={cx(L)} y1={modelY} y2={satY} stroke="var(--snow-2)" strokeWidth="1" strokeDasharray="2 3" />
          <path className="cs-sat__corr" d={corrected} pathLength="1" fill="none" stroke="var(--sun)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <g className="cs-sat__reading"><circle cx={cx(L)} cy={satY} r="5" fill="var(--night)" stroke="var(--sun)" strokeWidth="2" /></g>
          <text x={cx(L) - 8} y={satY + 4} textAnchor="end" className="cs-sat__label cs-sat__reading">satellite</text>
          <text x={cx(12)} y={cy(clearSky(12) * ktModel(12)) - 12} textAnchor="middle" className="cs-sat__label">model</text>
          <text x={cx(10.6)} y={cy(clearSky(10.6) * ktActual(10.6)) + 18} className="cs-sat__label cs-sat__label--actual">actual sky</text>
          <text x={cx(15.2)} y={corrY(15.2) - 6} className="cs-sat__label cs-sat__label--corr">corrected</text>
        </svg>
        <figcaption>Illustration at one point (Roorkee). The size of the nudge and how fast it fades are the fitted values.</figcaption>
      </figure>
      <div className="cs-sat__text">
        <p>
          Weather models are weakest in the first hours of a forecast, and a satellite picture is strongest there.
          Every hour, the app takes the newest Meteosat-derived irradiance at the chosen point, compares it with
          what the model expected for that hour, and nudges the next few hours towards it.
        </p>
        <p>
          The nudge is a fraction {d.a.toFixed(2)} of the gap, fading with a {d.tau_h} h time constant and gone by
          8 h. The satellite product reads high on clear days and sits an hour off, so the gap is aligned and
          debiased against its own last 7 days first. Weight and fade were fitted on the {d.fit} and scored on {d.score},
          against {d.reference}.
        </p>
        <dl className="cs-sat__stats">
          <div><dt className="t-display">{p(live.skill_vs_model)}</dt><dd>error in the first live hour (the feed is about {d.live_latency_h} h behind)</dd></div>
          <div><dt className="t-display">{p(d.leads[0].skill_vs_model)}</dt><dd>one hour after the reading</dd></div>
          <div><dt className="t-display">~{Math.round(d.tau_h)} h</dt><dd>until the correction fades out</dd></div>
        </dl>
        <p className="cs-sat__next">
          <strong>Next:</strong> forecasting from the pictures themselves, by tracking how clouds move between
          consecutive images and pushing them one to four hours ahead.
        </p>
      </div>
    </div>
  )
}
