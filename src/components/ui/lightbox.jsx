import { useEffect } from 'react'
import './lightbox.css'

// Full-screen image viewer. `item` is { src, caption } or null.
function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  if (!item) return null
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.caption} />
        <figcaption>{item.caption}</figcaption>
      </figure>
      <button className="lightbox__close" onClick={onClose} autoFocus>Close ✕</button>
    </div>
  )
}

export default Lightbox
