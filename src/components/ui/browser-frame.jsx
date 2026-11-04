import './browser-frame.css'

// A browser-window mock that cross-fades between two screenshots.
// `ratio` is the screenshots' width / height.
function BrowserFrame({ url, images, ratio = 1440 / 900, label }) {
  const [first, second] = images
  return (
    <div className="browser" role="img" aria-label={label}>
      <div className="browser__bar" aria-hidden="true">
        <span /><span /><span />
        <p className="browser__url">{url}</p>
      </div>
      <div className="browser__view" style={{ aspectRatio: ratio }}>
        <img src={first} alt="" loading="lazy" />
        {second && <img src={second} alt="" loading="lazy" className="browser__alt" />}
      </div>
    </div>
  )
}

export default BrowserFrame
