import { useEffect, useState } from 'react'

// Start from the bundled snapshot so the page renders instantly, then swap in
// the live file the app publishes, so retraining updates the case study too.
export function useLiveResults(url, snapshot) {
  const [state, setState] = useState({ data: snapshot, live: false })

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((data) => {
        if (data?.headline?.seen && Array.isArray(data.per_site)) setState({ data, live: true })
      })
      .catch(() => {})
    return () => controller.abort()
  }, [url])

  return state
}
