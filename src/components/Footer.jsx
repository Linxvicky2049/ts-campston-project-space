function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-grid">

          <div className="footer-brand">
            <span className="logo">PHOENIX</span>
            <p>
              Built by <strong style={{ color: "#7dd3fc" }}>Okafor Victor Somto</strong> aka <strong style={{ color: "#22d3ee" }}>BLACKSUN</strong> —
              a builder working across software, hardware, and creative tech.
              Pan-African. Full-stack. Always shipping.
            </p>
            <div className="footer-social">
              <a href="https://www.linkedin.com/in/somto-victor-2717783b4/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://dribbble.com/victor4all2015" target="_blank" rel="noreferrer">Dribbble</a>
              <a href="https://tsacademyonline.com/" target="_blank" rel="noreferrer">TS Academy</a>
              <a href="https://github.com/Linxvicky2049/ts-assignment-01" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Navigate</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#planets">Planets</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Planets</h4>
            <ul>
              <li><a href="#planets">Mercury</a></li>
              <li><a href="#planets">Mars</a></li>
              <li><a href="#planets">Jupiter</a></li>
              <li><a href="#planets">Saturn</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Connect</h4>
            <ul>
              <li><a href="#contact">Message</a></li>
              <li><a href="https://github.com/Linxvicky2049/ts-assignment-01" target="_blank" rel="noreferrer">Group Repo</a></li>
              <li><a href="https://tsacademyonline.com/" target="_blank" rel="noreferrer">TS Academy</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2025 Phoenix · Built by BLACKSUN with React & ☕</p>
          <span>PHOENIX / SYS-01</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer