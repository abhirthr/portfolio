import { useEffect, useState } from 'react'
import { ROORKEE, solarPosition, clearSkyGhi } from '../lib/sun'
import './SunNow.css'

const timeFmt = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
})

function read() {
  const now = new Date()
  const { elevation, hourAngle, cosZ } = solarPosition(now, ROORKEE.lat, ROORKEE.lon)
  return { time: timeFmt.format(now), elevation, hourAngle, ghi: clearSkyGhi(cosZ) }
}

// Small arc showing where the sun is on today's path (hour angle −110°…110°).
function SunArc({ hourAngle, up }) {
  const t = Math.max(0, Math.min(1, (hourAngle + 110) / 220))
  const x = 4 + t * 48
  const y = 22 - Math.sin(t * Math.PI) * 16
  return (
    <svg className="sun-now__arc" viewBox="0 0 56 26" aria-hidden="true">
      <path d="M4 22 Q28 -10 52 22" className="sun-now__path" />
      <line x1="0" x2="56" y1="22" y2="22" className="sun-now__horizon" />
      <circle cx={x} cy={up ? y : 22} r="4" className={up ? 'sun-now__sun' : 'sun-now__moon'} />
    </svg>
  )
}

// "Right now in Roorkee": live sun position and clear-sky irradiance, computed in the browser.
function SunNow() {
  const [s, setS] = useState(null)

  useEffect(() => {
    const tick = () => setS(read())
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  if (!s) return <p className="sun-now sun-now--placeholder" aria-hidden="true" />

  const up = s.elevation > 0
  return (
    <p
      className="sun-now"
      title="Computed in your browser from the sun's position (NOAA equations) and the Haurwitz clear-sky model. A cloud-free estimate, not a forecast."
    >
      <SunArc hourAngle={s.hourAngle} up={up} />
      <span className="sun-now__live"><span className="sun-now__dot" aria-hidden="true" />Live</span>
      <span>
        {ROORKEE.name} {s.time} IST ·{' '}
        {up ? (
          <>sun {Math.round(s.elevation)}° up · clear-sky <strong>{Math.round(s.ghi)} W/m²</strong></>
        ) : (
          <>the sun is down · solar output <strong>0 W/m²</strong></>
        )}
      </span>
    </p>
  )
}

export default SunNow
