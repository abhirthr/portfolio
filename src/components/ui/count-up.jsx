import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

// Counts a number like "62.97" or "36.9%" up from zero when it scrolls into view.
// The final text is rendered from the start, so it is correct without JS and for screen readers.
function CountUp({ value, duration = 1.4 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const match = /^(-?)([\d.]+)(.*)$/.exec(value)

  useEffect(() => {
    if (!inView || reduce || !match || !ref.current) return
    const [, sign, num, suffix] = match
    const target = parseFloat(num)
    const decimals = (num.split('.')[1] || '').length
    const el = ref.current
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => {
        el.textContent = `${sign}${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
    // match is derived from value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, duration])

  return <span ref={ref}>{value}</span>
}

export default CountUp
