import './browser-frame.css'

// A browser-window mock that cross-fades through two or three screenshots.
// `ratio` is the screenshots' width / height.
function BrowserFrame({ url, images, ratio = 1440 / 900, label }) {
  const [first, ...rest] = images
  const cycle = rest.length >= 2 ? 'browser__alt--3' : 'browser__alt--2'
  return (
    <div className="browser" role="img" aria-label={label}>
      <div className="browser__bar" aria-hidden="true">
        <span /><span /><span />
        <p className="browser__url">{url}</p>
      </div>
      <div className="browser__view" style={{ aspectRatio: ratio }}>
        <img src={first} alt="" loading="lazy" />
        {rest.slice(0, 2).map((src, i) => (
          <img key={src} src={src} alt="" loading="lazy" className={`browser__alt ${cycle} browser__pos-${i + 1}`} />
        ))}
      </div>
    </div>
  )
}

export default BrowserFrame
