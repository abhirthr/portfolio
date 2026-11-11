// Numbered case-study section: numeral + title on the left, body on the right.
function Section({ num, title, children, id }) {
  return (
    <section id={id} className="cs-section">
      <div className="cs-section__head">
        <span className="cs-section__num t-display">{num}</span>
        <h2 className="cs-section__title">{title}</h2>
      </div>
      <div className="cs-section__body">{children}</div>
    </section>
  )
}

export default Section
