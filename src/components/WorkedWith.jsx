import './WorkedWith.css'

const experiences = [
  {
    kind: 'Research',
    role: 'PhD Researcher',
    org: 'IIT Roorkee, Dept. of Hydro and Renewable Energy',
    period: 'Jul 2024 to present',
    location: 'Roorkee',
    summary: 'Machine learning for solar and wind forecasting across India.',
    link: { href: '#featured', label: 'India Renewables Forecast' },
    current: true,
  },
  {
    kind: 'Work',
    role: 'Research Engineer',
    org: 'IIT Roorkee',
    period: 'Jul 2022 to Jul 2024',
    location: 'Roorkee',
    summary: 'Day-ahead PV forecasting model, six-station data network and the ML-Sol web service.',
    link: { href: '#field', label: 'Field work and ML-Sol' },
  },
  {
    kind: 'Education',
    role: 'M.Tech, Power and Energy Systems',
    org: 'Energy Institute, Bengaluru (RGIPT)',
    period: 'Aug 2020 to Jun 2022',
    location: 'Bengaluru',
    summary: 'Institute Gold Medal for best academic performance.',
    link: { href: '#honors', label: 'Honors' },
  },
  {
    kind: 'Work',
    role: 'Data Analyst',
    org: 'Del2Infinity Energy Consulting',
    period: 'Mar 2018 to Jul 2020',
    location: 'Remote',
    summary: 'Statistical and numerical modelling to support energy-management decisions.',
  },
  {
    kind: 'Education',
    role: 'B.Tech, Electrical and Electronics',
    org: 'SRMCEM (AKTU)',
    period: 'Jul 2013 to Jun 2017',
    location: 'Lucknow',
    summary: 'Certificate of Merit in the 2nd, 3rd and 4th years.',
  },
]

const skills = [
  { group: 'Machine learning', items: ['Python', 'Time-series forecasting', 'Physics-informed ML', 'Mixture of experts', 'LSTM and attention', 'LightGBM', 'scikit-learn', 'TensorFlow / Keras', 'Feature engineering'] },
  { group: 'LLMs and edge AI', items: ['LLM fine-tuning for forecasting', 'LoRA / QLoRA', 'PyTorch', 'Hugging Face', 'llama.cpp', 'Prompt engineering', 'Gemma, Llama, Qwen', 'Knowledge distillation', 'Lightweight models', 'Raspberry Pi', 'Sensor integration'] },
  { group: 'Energy modelling', items: ['pvlib', 'Solar PV yield', 'Wind power curves', 'NWP and satellite data', 'Signal decomposition (EMD, FFT)', 'MATLAB / Simulink'] },
  { group: 'Engineering', items: ['FastAPI', 'Flask', 'Streamlit', 'React', 'Data pipelines', 'GitHub Actions', 'Vercel / Render'] },
]

function WorkedWith() {
  return (
    <section id="experience" className="worked-with day section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Experience</h2>
        </div>

        <div className="worked-with__grid">
          <ol className="timeline">
            {experiences.map((exp) => (
              <li key={exp.role} className={`timeline__item${exp.current ? ' timeline__item--current' : ''}`}>
                <span className="timeline__dot" aria-hidden="true" />
                <div className="timeline__meta">
                  <span className="timeline__period">{exp.period}</span>
                  <span className="timeline__kind">{exp.kind}, {exp.location}</span>
                </div>
                <div className="timeline__body">
                  <h3 className="timeline__role">{exp.role}</h3>
                  <p className="timeline__org">{exp.org}</p>
                  <p className="timeline__summary">{exp.summary}</p>
                  {exp.link && (
                    <a className="link timeline__link" href={exp.link.href}>
                      {exp.link.label}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="toolkit">
            <h3 className="toolkit__title">Toolkit</h3>
            <div className="toolkit__groups">
              {skills.map((g) => (
                <div key={g.group} className="toolkit__group">
                  <h4 className="toolkit__group-title">{g.group}</h4>
                  <ul className="toolkit__chips">
                    {g.items.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkedWith
