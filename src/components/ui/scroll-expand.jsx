import './scroll-expand.css'

function ScrollExpand({ id, title, children }) {
  return (
    <div id={id} className="scroll-expand">
      <h3 className="scroll-expand__heading">{title}</h3>
      <div className="scroll-expand__content">{children}</div>
    </div>
  )
}

export default ScrollExpand
