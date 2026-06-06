export async function fetchPlanets() {
  const response = await fetch(
    "https://anurella.github.io/json/planets.json"
  )

  if (!response.ok) {
    throw new Error("Failed to fetch planets")
  }

  const data = await response.json()

  console.log("Raw data:", data)

  return data
}