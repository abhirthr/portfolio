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
