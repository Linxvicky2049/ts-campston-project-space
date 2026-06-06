import { useEffect, useState } from "react"
import { fetchPlanets } from "../services/api"
import PlanetCard from "./PlanetCard"

function PlanetSection() {
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getPlanets() {
      try {
        const data = await fetchPlanets()
        console.log("Planets received:", data)
        setPlanets(data)
      } catch (err) {
        console.error(err)
        setError("Could not load planet data. Check your connection.")
      } finally {
        setLoading(false)
      }
    }
    getPlanets()
  }, [])

  return (
    <section id="planets" style={{ minHeight: "60vh", padding: "5rem 2rem" }}>
      <div className="container">
        <h2>Planet Data</h2>

        {loading && <p>Loading planets...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className="planet-grid">
         {planets.map((planet) => (
  <PlanetCard key={planet.planet} planet={planet} />
))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PlanetSection