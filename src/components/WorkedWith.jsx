import './WorkedWith.css'

const experiences = [
  {
    company: 'IIT Roorkee',
    role: 'PhD Researcher',
    period: '07/24 – Present',
    location: 'Roorkee',
  },
  {
    company: 'IIT Roorkee',
    role: 'Research Engineer',
    period: '07/22 – 07/24',
    location: 'Roorkee',
  },
  {
    company: 'Energy Institute, RGIPT',
    role: 'M.Tech – Power & Energy Systems',
    period: '08/20 – 06/22',
    location: 'Bengaluru',
  },
  {
    company: 'Del2Infinity Energy Consulting',
    role: 'Data Analyst',
    period: '03/18 – 07/20',
    location: 'Remote',
  },
  {
    company: 'SRMCEM (AKTU)',
    role: 'B.Tech – Electrical & Electronics',
    period: '07/13 – 06/17',
    location: 'Lucknow',
  },
]

function WorkedWith() {
  return (
    <section id="experience" className="worked-with">
<div className="worked-with__inner">
        <h2 className="worked-with__title">
          Experience
        </h2>

        <div className="worked-with__table">
          {experiences.map((exp, index) => (
            <div key={index} className="worked-with__row">
              <span className="worked-with__company">{exp.company}</span>
              <span className="worked-with__role">{exp.role}</span>
              <span className="worked-with__period">{exp.period}</span>
              <span className="worked-with__location">{exp.location}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkedWith
