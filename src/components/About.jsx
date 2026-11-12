import { CV_URL, CONTACT_EMAIL } from '../lib/site'
import './About.css'

function About() {
  return (
    <section id="about" className="about night">
      <h2 className="visually-hidden">About and contact</h2>
      <div className="about__inner container">
        <div className="about__content">
          <p className="about__quote">
            I research because I believe data can transform how we power the world: smart systems
            that make clean energy more reliable.
          </p>
          <div id="contact" className="about__contact">
            <p className="about__contact-lead">
              Open to research collaborations and roles in renewable-energy forecasting. The quickest
              way to reach me is email.
            </p>
            <div className="about__contact-links">
              <a className="btn btn--primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {CV_URL && <a className="btn" href={CV_URL} download>Download CV</a>}
            </div>
            <ul className="about__profiles">
              <li><a className="link" href="https://linkedin.com/in/arthr" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a className="link" href="https://scholar.google.com/citations?user=NRMwxt8AAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar</a></li>
              <li><a className="link" href="https://github.com/abhirthr" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="about__photo">
          <img
            src="/images/abhijeet.jpg"
            alt="Abhijeet Rathore"
            className="about__photo-img"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export default About
