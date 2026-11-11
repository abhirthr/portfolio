import { useEffect, useState } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ROORKEE, solarPosition, clearSkyGhi } from '../lib/sun'
import './SolarDay.css'

// Today's clear-sky irradiance curve over Roorkee, with the sun marked where it
// is right now. Computed in the browser (NOAA solar position + Haurwitz model),
// so it is rendered after mount: the prerendered HTML carries only the frame.
const IST = 330 // minutes east of UTC
// Wide screens get a 1200×250 frame; phones a squarer 600×300 one so the
// curve keeps some height at 360px wide.
const FRAMES = {
  wide: { W: 1200, H: 250, TOP: 56, hours: [0, 3, 6, 9, 12, 15, 18, 21, 24] },
  narrow: { W: 600, H: 300, TOP: 64, hours: [0, 6, 12, 18, 24] },
}
const Y_MAX = 1100
const STEP = 5

const hhmm = (m) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m) % 60).padStart(2, '0')}`

function readDay(now) {
  const shifted = new Date(now.getTime() + IST * 60000)
  const midnight =
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - IST * 60000
  const pts = []
  for (let m = 0; m <= 1440; m += STEP) {
    const { cosZ } = solarPosition(new Date(midnight + m * 60000), ROORKEE.lat, ROORKEE.lon)
    pts.push({ m, ghi: clearSkyGhi(cosZ) })
  }
  const lit = pts.filter((p) => p.ghi > 0)
  const peak = pts.reduce((a, b) => (b.ghi > a.ghi ? b : a))
  const nowMin = (now.getTime() - midnight) / 60000
  const { cosZ } = solarPosition(now, ROORKEE.lat, ROORKEE.lon)
  const dateLabel = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Kolkata',
  }).format(now)
  return {
    pts,
    nowMin,
    ghiNow: clearSkyGhi(cosZ),
    sunrise: lit[0]?.m,
    sunset: lit[lit.length - 1]?.m,
    peak,
    dateLabel,
  }
}

function SolarDay() {
  const [d, setD] = useState(null)
  const [narrow, setNarrow] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const tick = () => setD(readDay(new Date()))
    tick()
    const id = setInterval(tick, 60000)
    const mq = window.matchMedia('(max-width: 600px)')
    const onChange = () => setNarrow(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => {
      clearInterval(id)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  const { W, H, TOP, hours: HOURS } = FRAMES[narrow ? 'narrow' : 'wide']
  const BASE = H - 30
  const x = (m) => (m / 1440) * W
  const y = (g) => BASE - (g / Y_MAX) * (BASE - TOP)
  const toPath = (pts) =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.m).toFixed(1)},${y(p.ghi).toFixed(1)}`).join(' ')

  const up = d ? d.ghiNow > 0 : false
  const nowX = d ? x(d.nowMin) : 0
  const nowY = d ? y(d.ghiNow) : BASE
  const soFar = d ? [...d.pts.filter((p) => p.m <= d.nowMin), { m: d.nowMin, ghi: d.ghiNow }] : []
  const areaPath = d ? `${toPath(soFar)} L${nowX.toFixed(1)},${BASE} L0,${BASE} Z` : ''
  const flip = d ? d.nowMin > 1440 * (narrow ? 0.6 : 0.74) : false
  const labelX = nowX + (flip ? -14 : 14)
  const labelY = Math.max(TOP - 40, nowY - 46)

  const summary = d
    ? `Clear-sky irradiance over Roorkee on ${d.dateLabel}: ${Math.round(d.ghiNow)} watts per square metre at ${hhmm(d.nowMin)} IST. Sunrise ${hhmm(d.sunrise)}, peak ${Math.round(d.peak.ghi)} at ${hhmm(d.peak.m)}, sunset ${hhmm(d.sunset)}.`
    : 'Clear-sky irradiance over Roorkee today, computed in the browser.'

  return (
    <figure className="solar-day">
      <svg viewBox={`0 0 ${W} ${H}`} className="solar-day__svg" role="img" aria-label={summary}>
        <defs>
          <linearGradient id="solar-day-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sun)" stopOpacity="0.42" />
            <stop offset="1" stopColor="var(--sun)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {HOURS.map((h) => (
          <g key={h}>
            <line x1={x(h * 60)} x2={x(h * 60)} y1={TOP - 20} y2={BASE} className="solar-day__grid" />
            <text
              x={x(h * 60)}
              y={H - 6}
              textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}
              className="solar-day__tick"
            >
              {hhmm(h * 60)}
            </text>
          </g>
        ))}
        <line x1="0" x2={W} y1={BASE} y2={BASE} className="solar-day__horizon" />

        {d && (
          <>
            <Motion.path
              d={areaPath}
              className="solar-day__area"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.9 }}
            />
            <Motion.path
              d={toPath(d.pts)}
              className="solar-day__line"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.9, ease: 'easeInOut' }}
            />
            {!narrow && d.sunrise !== undefined && (
              <>
                <text x={x(d.sunrise)} y={BASE - 10} textAnchor="middle" className="solar-day__tick">
                  sunrise {hhmm(d.sunrise)}
                </text>
                <text x={x(d.sunset)} y={BASE - 10} textAnchor="middle" className="solar-day__tick">
                  sunset {hhmm(d.sunset)}
                </text>
              </>
            )}
            <Motion.g
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <line x1={nowX} x2={nowX} y1={nowY} y2={BASE} className="solar-day__now-line" />
              <circle cx={nowX} cy={nowY} r="6" className={up ? 'solar-day__now-dot' : 'solar-day__now-dot solar-day__now-dot--down'} />
              <text x={labelX} y={labelY} textAnchor={flip ? 'end' : 'start'} className="solar-day__label">
                now, {hhmm(d.nowMin)} IST
              </text>
              <text x={labelX} y={labelY + 22} textAnchor={flip ? 'end' : 'start'} className="solar-day__label solar-day__label--value">
                {up ? `${Math.round(d.ghiNow)} W/m² clear-sky` : 'the sun is down'}
              </text>
            </Motion.g>
          </>
        )}
      </svg>
      <figcaption className="solar-day__caption">
        <span>
          <span className="solar-day__live" aria-hidden="true" />
          {d
            ? `Clear-sky irradiance over Roorkee, ${d.dateLabel}. Sunrise ${hhmm(d.sunrise)}, peak ${Math.round(d.peak.ghi)} W/m² at ${hhmm(d.peak.m)}, sunset ${hhmm(d.sunset)}.`
            : 'Clear-sky irradiance over Roorkee today.'}
        </span>
        <span>Computed in your browser from the sun’s position (NOAA) and the Haurwitz clear-sky model. A cloud-free reference, not a forecast.</span>
      </figcaption>
    </figure>
  )
}

export default SolarDay
