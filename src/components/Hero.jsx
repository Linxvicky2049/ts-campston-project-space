import spaceVideo from "../assets/videos/space.mp4"

function Hero() {
  return (
    <section id="hero" className="hero">

      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={spaceVideo} type="video/mp4" />
      </video>

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-subtitle">
          Journey Beyond Earth
        </p>

        <h1>
          Explore The Cosmos
        </h1>

        <p className="hero-description">
          Discover planets, stars and celestial mysteries
          across the universe through immersive space data.
        </p>

        <div className="hero-buttons">

          <a href="#planets" className="primary-btn">
            Explore Data
          </a>

          <a href="#contact" className="secondary-btn">
            Contact Us
          </a>

        </div>

      </div>

    </section>
  )
}

export default Hero