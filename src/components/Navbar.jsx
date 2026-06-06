function Navbar() {
  return (
    <nav className="navbar">

      <div className="container navbar-content">

        <h2 className="logo">
          Phoenix Project
        </h2>

        <ul className="nav-links">

          <li>
            <a href="#hero">Home</a>
          </li>

          <li>
            <a href="#planets">Planets</a>
          </li>

          <li>
            <a href="#about">About</a>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>

        </ul>

      </div>

    </nav>
  )
}

export default Navbar