import ScrollExpand from './ui/scroll-expand'
import './SelectedWork.css'

const publications = [
  {
    type: 'Patent',
    title: 'A System and Method for Forecasting Solar Photovoltaic Power Using Machine Learning',
    venue: 'iHUB DivyaSampark, IIT Roorkee',
    detail: 'Granted 16 Feb 2026 — Patent No. 580682 (Application No. 202311059664)',
    link: '/images/patent-certificate.webp',
  },
  {
    type: 'Journal',
    title: 'Day ahead solar forecast using long short term memory network augmented with Fast Fourier transform-assisted decomposition technique',
    venue: 'Renewable Energy 247 (2025): 123021',
    detail: null,
    link: 'https://doi.org/10.1016/j.renene.2025.123021',
  },
  {
    type: 'Journal',
    title: 'Energy, exergy and performance analysis of a 380 kWP roof-top PV plant assisted with data-driven models for energy generation',
    venue: 'Journal of Thermal Engineering 10.5 (2024): 1164–1183',
    detail: null,
    link: null,
  },
  {
    type: 'Conference',
    title: 'An IoT-Based Automatic Light Control System for Smart Buildings',
    venue: 'International Conference on Signal, Machines, Automation, and Algorithm — Springer Nature Singapore, 2023',
    detail: null,
    link: 'https://doi.org/10.1007/978-981-97-6349-842',
  },
  {
    type: 'Book Chapter',
    title: 'Configurations of Converters applied to Electric Vehicles with comprehensive control strategies and optimization',
    venue: 'Power Electronics for Electric Vehicles and Energy Storage — CRC Press, Taylor & Francis Group',
    detail: 'Accepted for publication',
    link: null,
  },
  {
    type: 'Conference',
    title: 'Building Energy Management Through Load Control Using Internet of Things',
    venue: 'Innovations in Power and Advanced Computing Technologies (i-PACT), 2021, pp. 1–6',
    detail: null,
    link: 'https://doi.org/10.1109/i-PACT52855.2021.9696596',
  },
]

const projects = [
  {
    label: 'M.Tech Thesis',
    title: 'Yield Modelling and Data-Driven Feasibility Analysis of Solar PV and Solar Thermal Systems',
    description:
      'Developed a data-driven model for solar PV energy yield forecasting with integrated optimization to maximize performance under varying climates. Enabled site-specific feasibility and parameter tuning for utility-scale and distributed installations using MATLAB and statistical techniques.',
  },
  {
    label: 'B.Tech Project',
    title: 'Enhancement of Voltage Quality in Isolated Power Systems',
    description:
      'Designed a battery-backed Series Compensator in MATLAB/Simulink to reduce Total Harmonic Distortion (THD) and improve voltage stability by actively compensating faults in isolated grids.',
  },
]

const training = [
  { label: 'Industrial Training', title: 'UPPCL, Lucknow', detail: '132 kV substation operations: transformers, switchgear, CT/PT, grid protection' },
  { label: 'Workshop', title: 'Industrial Automation, Sofcon (SRMCEM)', detail: 'PLC programming, HMI, SCADA, relay logic, sensor integration' },
  { label: 'Summer Training', title: 'UNICON PLC Automation', detail: 'MATLAB control systems, dynamic system modelling, signal processing' },
]

const honors = [
  {
    title: 'Institute Gold Medal',
    org: 'Rajiv Gandhi Institute of Petroleum Technology (RGIPT)',
    detail: 'Best academic performance, M.Tech Power and Energy Systems Engineering',
    gold: true,
  },
  {
    title: 'Certificate of Merit',
    org: 'SRMCEM, Lucknow',
    detail: 'Outstanding academic achievement in the 2nd, 3rd and 4th years of B.Tech',
  },
  {
    title: 'Merit Certificate',
    org: 'Central Board of Secondary Education (CBSE)',
    detail: 'Exemplary performance in the Class 12 examinations',
  },
]

const courses = [
  { title: 'Gen AI Foundational Models for NLP & Language Understanding', provider: 'IBM / Coursera' },
  { title: 'Generative AI and LLMs: Architecture and Data Preparation', provider: 'IBM / Coursera' },
  { title: 'Google Data Analytics Certificate', provider: 'Google / Coursera' },
  { title: 'Programming for Everybody (Getting Started with Python)', provider: 'University of Michigan / Coursera' },
  { title: 'Python Data Structures', provider: 'University of Michigan / Coursera' },
  { title: 'Intro to Machine Learning & Intermediate Machine Learning', provider: 'Kaggle' },
  { title: 'Neural Networks and Deep Learning', provider: 'DeepLearning.AI / Coursera' },
  { title: 'MATLAB and Simulink Onramp', provider: 'MathWorks' },
  { title: 'Machine Learning with MATLAB', provider: 'MathWorks' },
  { title: 'Solving Ordinary Differential Equations with MATLAB', provider: 'MathWorks' },
  { title: 'Machine Learning and Data Science Bootcamp', provider: 'Udemy' },
  { title: 'Machine Learning', provider: 'Andrew Ng / Stanford University' },
]

function SelectedWork() {
  return (
    <section id="work" className="selected-work">
      <div className="selected-work__panels">
        <ScrollExpand
          title="Publications"
                  >
          <ol className="pub-list">
            {publications.map((pub, i) => (
              <li key={i} className="pub-item">
                <span className="pub-type">{pub.type}</span>
                <p className="pub-title">
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">{pub.title}</a>
                  ) : (
                    pub.title
                  )}
                </p>
                <p className="pub-venue">{pub.venue}</p>
                {pub.detail && <p className="pub-detail">{pub.detail}</p>}
              </li>
            ))}
          </ol>
        </ScrollExpand>

        <ScrollExpand title="Research Projects">
          <div className="project-list">
            {projects.map((p, i) => (
              <div key={i} className="project-item">
                <span className="project-label">{p.label}</span>
                <h4 className="project-title">{p.title}</h4>
                <p className="project-desc">{p.description}</p>
              </div>
            ))}
          </div>
          <h4 className="training-heading">Earlier training</h4>
          <ul className="training-list">
            {training.map((t) => (
              <li key={t.title} className="training-item">
                <span className="project-label">{t.label}</span>
                <span className="training-title">{t.title}</span>
                <span className="training-detail">{t.detail}</span>
              </li>
            ))}
          </ul>
        </ScrollExpand>

        <ScrollExpand id="honors" title="Honors & Awards">
          <ul className="honor-list">
            {honors.map((h) => (
              <li key={h.title} className={`honor-item${h.gold ? ' honor-item--gold' : ''}`}>
                <span className="honor-icon" aria-hidden="true">{h.gold ? '★' : '◆'}</span>
                <div>
                  <h4 className="honor-title">{h.title}</h4>
                  <p className="honor-org">{h.org}</p>
                  <p className="honor-detail">{h.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollExpand>

        <ScrollExpand
          title="Courses & Certifications"
                  >
          <ul className="course-list">
            {courses.map((c, i) => (
              <li key={i} className="course-item">
                <span className="course-title">{c.title}</span>
                <span className="course-provider">{c.provider}</span>
              </li>
            ))}
          </ul>
        </ScrollExpand>
      </div>
    </section>
  )
}

export default SelectedWork
