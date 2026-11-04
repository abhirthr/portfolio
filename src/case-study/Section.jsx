import { motion as Motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// Numbered case-study section: number + title on the left, body on the right.
function Section({ num, title, children, id }) {
  return (
    <Motion.section
      id={id}
      className="cs-section"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="cs-section__head">
        <span className="cs-section__num">{num}</span>
        <h2 className="cs-section__title">{title}</h2>
      </div>
      <div className="cs-section__body">{children}</div>
    </Motion.section>
  )
}

export default Section
