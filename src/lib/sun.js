// Solar position (NOAA general solar position equations) and the Haurwitz
// clear-sky model as implemented in pvlib. Pure functions, no network.

const RAD = Math.PI / 180

export const ROORKEE = { name: 'Roorkee', lat: 29.8649, lon: 77.8966 }

export function solarPosition(date, lat, lon) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1)
  const doy = Math.floor((date.getTime() - start) / 86400000) + 1
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  const g = ((2 * Math.PI) / 365) * (doy - 1 + (hour - 12) / 24)

  const eqtime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g)

  const trueSolarMin = hour * 60 + eqtime + 4 * lon
  const hourAngle = trueSolarMin / 4 - 180 // degrees, 0 at solar noon
  const cosZ =
    Math.sin(lat * RAD) * Math.sin(decl) + Math.cos(lat * RAD) * Math.cos(decl) * Math.cos(hourAngle * RAD)
  const elevation = 90 - Math.acos(Math.max(-1, Math.min(1, cosZ))) / RAD

  return { elevation, hourAngle: ((hourAngle + 540) % 360) - 180, cosZ }
}

// Haurwitz (1945) clear-sky GHI in W/m², pvlib form: 1098 · cosZ · exp(−0.059 / cosZ).
export function clearSkyGhi(cosZ) {
  if (cosZ <= 0) return 0
  return 1098 * cosZ * Math.exp(-0.059 / cosZ)
}
