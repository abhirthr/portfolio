import { CV_URL, CONTACT_EMAIL } from '../lib/site'
import './About.css'

function About() {
  return (
    <section id="about" className="about">
<div className="about__inner">
        <div className="about__content">
          <p className="about__quote">
            I love to{' '}
            <span className="about__highlight about__highlight--purple">research,</span>{' '}
            because I believe data can{' '}
            transform how we power the world.{' '}
            Building{' '}
            <span className="about__highlight about__highlight--yellow">smart</span>{' '}
            systems that make clean energy more{' '}
            <span className="about__highlight about__highlight--blue">reliable.</span>
          </p>
          <div id="contact" className="about__contact">
            <p className="about__contact-lead">
              Open to research collaborations and roles in renewable-energy forecasting.
            </p>
            <div className="about__contact-links">
              <a className="about__btn about__btn--primary" href={`mailto:${CONTACT_EMAIL}`}>Email me</a>
              <a className="about__btn" href="https://linkedin.com/in/arthr" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className="about__btn" href="https://scholar.google.com/citations?user=NRMwxt8AAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a>
              {CV_URL && <a className="about__btn" href={CV_URL} download>Download CV</a>}
            </div>
          </div>
        </div>
        <div className="about__photo">
          <div className="about__photo-wrapper">
            <img
              src="/images/abhijeet.jpg"
              alt="Abhijeet Rathore"
              className="about__photo-img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
