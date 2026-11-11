import './scroll-expand.css'

// A titled panel on the day background: serif heading above its content.
function ScrollExpand({ id, title, children }) {
  return (
    <div id={id} className="panel">
      <div className="container">
        <h3 className="panel__heading">{title}</h3>
        <div className="panel__content">{children}</div>
      </div>
    </div>
  )
}

export default ScrollExpand
