import { useEffect, useState } from 'react'

// Start from the bundled snapshot so the page renders instantly, then swap in
// the live file the app publishes, so retraining updates the case study too.
const isModelResults = (d) => d?.headline?.seen && Array.isArray(d.per_site)

export function useLiveResults(url, snapshot, isValid = isModelResults) {
  const [state, setState] = useState({ data: snapshot, live: false })

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((data) => {
        if (isValid(data)) setState({ data, live: true })
      })
      .catch(() => {})
    return () => controller.abort()
  }, [url]) // eslint-disable-line react-hooks/exhaustive-deps -- isValid is fixed per caller

  return state
}
