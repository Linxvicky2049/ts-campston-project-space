function PlanetCard({ planet }) {
  return (
    <figure className="planet-card">

      <img
        src={planet.image}
        alt={planet.planet}
        className="planet-img"
      />

      <figcaption>
        <h3>{planet.planet}</h3>
        <p>Distance from Sun: {planet.distanceFromSun} million km</p>
      </figcaption>

    </figure>
  )
}

export default PlanetCard