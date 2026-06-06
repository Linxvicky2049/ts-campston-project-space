function About() {
  return (
    <section id="about" className="about">
      <div className="container">

        <div className="about-grid">

          <div className="about-text">
            <p className="section-label">Who We Are</p>
            <h2>Exploring The Universe Through Data</h2>
            <p>
              Phoenix is a space exploration platform dedicated to bringing
              the wonders of our solar system closer to everyone on Earth.
              We combine real astronomical data with immersive design to
              make space education accessible and inspiring.
            </p>
            <p>
              From the scorched surface of Mercury to the icy depths of
              Neptune, every planet tells a story. We're here to help
              you read it.
            </p>
            <a href="#contact" className="primary-btn">Get In Touch</a>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <h3>8+</h3>
              <p>Planets Tracked</p>
            </div>
            <div className="stat-card">
              <h3>4.5B</h3>
              <p>Years of Solar History</p>
            </div>
            <div className="stat-card">
              <h3>∞</h3>
              <p>Things To Discover</p>
            </div>
            <div className="stat-card">
              <h3>1</h3>
              <p>Universe We Call Home</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default About