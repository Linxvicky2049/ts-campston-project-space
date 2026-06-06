import { useEffect, useRef, useState, useCallback } from "react"

const AU_SCALE = 170
const SUN_MU = 1.32712440018e11 // km^3/s^2
const AU_IN_KM = 149597870.7

const PLANETS = [
  {
    name: "Mercury",
    radius: 4,
    color: "#b5b5b5",
    info: "Closest planet to the Sun",
    diameter: "4,879 km",
    moons: 0,
    temp: "430°C",
    semiMajorAxis: 0.387,
    eccentricity: 0.2056,
    orbitalPeriodDays: 88,
  },
  {
    name: "Venus",
    radius: 7,
    color: "#e8c97a",
    info: "Hottest planet",
    diameter: "12,104 km",
    moons: 0,
    temp: "465°C",
    semiMajorAxis: 0.723,
    eccentricity: 0.0067,
    orbitalPeriodDays: 225,
  },
  {
    name: "Earth",
    radius: 8,
    color: "#4fc3f7",
    info: "Our home planet",
    diameter: "12,742 km",
    moons: 1,
    temp: "15°C",
    semiMajorAxis: 1,
    eccentricity: 0.0167,
    orbitalPeriodDays: 365.25,
  },
  {
    name: "Mars",
    radius: 5,
    color: "#ef5350",
    info: "The Red Planet",
    diameter: "6,779 km",
    moons: 2,
    temp: "-65°C",
    semiMajorAxis: 1.524,
    eccentricity: 0.0934,
    orbitalPeriodDays: 687,
  },
  {
    name: "Jupiter",
    radius: 18,
    color: "#c8956c",
    info: "Largest planet",
    diameter: "139,820 km",
    moons: 95,
    temp: "-110°C",
    semiMajorAxis: 5.203,
    eccentricity: 0.0489,
    orbitalPeriodDays: 4331,
  },
  {
    name: "Saturn",
    radius: 15,
    color: "#e8d5a3",
    info: "Famous for its rings",
    diameter: "116,460 km",
    moons: 146,
    temp: "-140°C",
    semiMajorAxis: 9.537,
    eccentricity: 0.0565,
    orbitalPeriodDays: 10747,
    hasRing: true,
  },
  {
    name: "Uranus",
    radius: 11,
    color: "#80deea",
    info: "Ice giant",
    diameter: "50,724 km",
    moons: 28,
    temp: "-195°C",
    semiMajorAxis: 19.191,
    eccentricity: 0.046,
    orbitalPeriodDays: 30589,
  },
  {
    name: "Neptune",
    radius: 10,
    color: "#3f51b5",
    info: "Farthest planet",
    diameter: "49,244 km",
    moons: 16,
    temp: "-200°C",
    semiMajorAxis: 30.07,
    eccentricity: 0.009,
    orbitalPeriodDays: 59800,
  },
]

function solveKepler(M, e, iterations = 6) {
  let E = M

  for (let i = 0; i < iterations; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
  }

  return E
}

function getPlanetPosition(planet, time) {
  const a = planet.semiMajorAxis
  const e = planet.eccentricity
  const period = planet.orbitalPeriodDays

  const meanMotion = (2 * Math.PI) / period
  const M = meanMotion * time

  const E = solveKepler(M, e)

  const trueAnomaly =
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )

  const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly))

  return {
    x: Math.cos(trueAnomaly) * r,
    y: Math.sin(trueAnomaly) * r,
    r,
    theta: trueAnomaly,
  }
}

function calculateHohmannTransfer(targetPlanet) {
  const r1 = 1 * AU_IN_KM
  const r2 = targetPlanet.semiMajorAxis * AU_IN_KM

  const transferSemiMajorAxis = (r1 + r2) / 2

  const transferTimeSeconds =
    Math.PI *
    Math.sqrt(
      Math.pow(transferSemiMajorAxis, 3) / SUN_MU
    )

  const transferDays =
    transferTimeSeconds / (60 * 60 * 24)

  const deltaV1 =
    Math.sqrt(SUN_MU / r1) *
    (
      Math.sqrt((2 * r2) / (r1 + r2)) - 1
    )

  const deltaV2 =
    Math.sqrt(SUN_MU / r2) *
    (
      1 - Math.sqrt((2 * r1) / (r1 + r2))
    )

  const phaseAngle =
    180 -
    (
      (360 * transferDays) /
      targetPlanet.orbitalPeriodDays
    )

  return {
    transferDays: Math.round(transferDays),
    deltaV1: Math.abs(deltaV1).toFixed(2),
    deltaV2: Math.abs(deltaV2).toFixed(2),
    phaseAngle: phaseAngle.toFixed(1),
  }
}

export default function SolarSystem() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const zoom = useRef(1)
  const offset = useRef({ x: 0, y: 0 })

  const dragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const simTime = useRef(0)

  const transferRef = useRef({
    active: false,
    target: null,
    progress: 0,
  })

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    const hit = PLANETS.find(
      (p) =>
        p._x &&
        Math.hypot(mx - p._x, my - p._y) < p.radius * zoom.current + 8
    )

    if (!hit) return

    setSelected(hit)

    if (hit.name !== "Earth") {
      transferRef.current = {
        active: true,
        target: hit,
        progress: 0,
      }
    } else {
      transferRef.current = {
        active: false,
        target: null,
        progress: 0,
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    function draw() {
      const W = canvas.width = canvas.offsetWidth
      const H = canvas.height = canvas.offsetHeight

      const cx = W / 2 + offset.current.x
      const cy = H / 2 + offset.current.y

      ctx.clearRect(0, 0, W, H)

      simTime.current += 0.35

      // Background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.7)
      bg.addColorStop(0, "rgba(8,20,40,0.45)")
      bg.addColorStop(1, "#020611")

      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Stars
      for (let i = 0; i < 120; i++) {
        const x = (i * 97) % W
        const y = (i * 53) % H

        ctx.fillStyle = `rgba(255,255,255,${
          0.2 + ((i % 5) * 0.15)
        })`

        ctx.beginPath()
        ctx.arc(x, y, (i % 2) + 0.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Sun glow
      const sunRadius = 30 * zoom.current

      const sunGlow = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        sunRadius * 4
      )

      sunGlow.addColorStop(0, "rgba(255,220,120,0.9)")
      sunGlow.addColorStop(0.4, "rgba(255,150,30,0.35)")
      sunGlow.addColorStop(1, "transparent")

      ctx.fillStyle = sunGlow

      ctx.beginPath()
      ctx.arc(cx, cy, sunRadius * 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#fff2b8"

      ctx.beginPath()
      ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2)
      ctx.fill()

      // Planets
      PLANETS.forEach((planet) => {
        const pos = getPlanetPosition(
          planet,
          simTime.current
        )

        const px =
          cx +
          pos.x *
            AU_SCALE *
            zoom.current

        const py =
          cy +
          pos.y *
            AU_SCALE *
            zoom.current

        const orbitRadius =
          planet.semiMajorAxis *
          AU_SCALE *
          zoom.current

        // Orbit ellipse
        ctx.beginPath()
        ctx.strokeStyle = "rgba(125,211,252,0.08)"
        ctx.lineWidth = 0.7

        for (let a = 0; a <= Math.PI * 2; a += 0.02) {
          const rr =
            (planet.semiMajorAxis *
              (1 - planet.eccentricity ** 2)) /
            (
              1 +
              planet.eccentricity *
                Math.cos(a)
            )

          const ox =
            cx +
            Math.cos(a) *
              rr *
              AU_SCALE *
              zoom.current

          const oy =
            cy +
            Math.sin(a) *
              rr *
              AU_SCALE *
              zoom.current

          if (a === 0) {
            ctx.moveTo(ox, oy)
          } else {
            ctx.lineTo(ox, oy)
          }
        }

        ctx.stroke()

        // Glow
        const isHovered =
          hovered?.name === planet.name

        const isSelected =
          selected?.name === planet.name

        if (isHovered || isSelected) {
          const glow =
            ctx.createRadialGradient(
              px,
              py,
              orbitRadius * 0.02,
              px,
              py,
              planet.radius *
                zoom.current *
                4
            )

          glow.addColorStop(
            0,
            `${planet.color}66`
          )

          glow.addColorStop(
            1,
            "transparent"
          )

          ctx.fillStyle = glow

          ctx.beginPath()
          ctx.arc(
            px,
            py,
            planet.radius *
              zoom.current *
              4,
            0,
            Math.PI * 2
          )

          ctx.fill()
        }

        // Saturn ring
        if (planet.hasRing) {
          ctx.save()

          ctx.translate(px, py)
          ctx.scale(1, 0.35)

          ctx.beginPath()
          ctx.arc(
            0,
            0,
            planet.radius *
              zoom.current *
              2.3,
            0,
            Math.PI * 2
          )

          ctx.strokeStyle =
            `${planet.color}99`

          ctx.lineWidth =
            planet.radius *
            zoom.current *
            0.5

          ctx.stroke()

          ctx.restore()
        }

        // Planet body
        const grad =
          ctx.createRadialGradient(
            px -
              planet.radius *
                zoom.current *
                0.3,
            py -
              planet.radius *
                zoom.current *
                0.3,
            0,
            px,
            py,
            planet.radius *
              zoom.current
          )

        grad.addColorStop(0, "#ffffff99")
        grad.addColorStop(0.4, planet.color)
        grad.addColorStop(1, "#000000cc")

        ctx.fillStyle = grad

        ctx.beginPath()
        ctx.arc(
          px,
          py,
          planet.radius * zoom.current,
          0,
          Math.PI * 2
        )

        ctx.fill()

        // Labels
        if (
          isHovered ||
          isSelected ||
          zoom.current > 1.4
        ) {
          ctx.fillStyle = "#7dd3fc"

          ctx.font =
            `${Math.max(
              10,
              11 * zoom.current
            )}px Orbitron`

          ctx.textAlign = "center"

          ctx.fillText(
            planet.name.toUpperCase(),
            px,
            py -
              planet.radius *
                zoom.current -
              10
          )
        }

        planet._x = px
        planet._y = py
      })

      // Hohmann Transfer Orbit
      const transfer = transferRef.current

      if (
        transfer.active &&
        transfer.target
      ) {
        const earth = PLANETS.find(
          (p) => p.name === "Earth"
        )

        const earthPos =
          getPlanetPosition(
            earth,
            simTime.current
          )

        const targetPos =
          getPlanetPosition(
            transfer.target,
            simTime.current
          )

        const ex =
          cx +
          earthPos.x *
            AU_SCALE *
            zoom.current

        const ey =
          cy +
          earthPos.y *
            AU_SCALE *
            zoom.current

        const tx =
          cx +
          targetPos.x *
            AU_SCALE *
            zoom.current

        const ty =
          cy +
          targetPos.y *
            AU_SCALE *
            zoom.current

        transfer.progress += 0.0025

        if (transfer.progress > 1) {
          transfer.progress = 1
        }

        // Elliptical transfer path
        ctx.save()

        ctx.strokeStyle =
          "rgba(125,211,252,0.9)"

        ctx.lineWidth = 1.8

        ctx.setLineDash([8, 5])

        ctx.shadowColor = "#7dd3fc"
        ctx.shadowBlur = 12

        ctx.beginPath()

        for (
          let t = 0;
          t <= transfer.progress;
          t += 0.01
        ) {
          const x =
            (1 - t) * ex +
            t * tx +
            Math.sin(t * Math.PI) *
              (cy - ey) *
              0.3

          const y =
            (1 - t) * ey +
            t * ty -
            Math.sin(t * Math.PI) *
              (cx - ex) *
              0.15

          if (t === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()

        ctx.restore()

        // Spacecraft
        const t = transfer.progress

        const sx =
          (1 - t) * ex +
          t * tx +
          Math.sin(t * Math.PI) *
            (cy - ey) *
            0.3

        const sy =
          (1 - t) * ey +
          t * ty -
          Math.sin(t * Math.PI) *
            (cx - ex) *
            0.15

        ctx.fillStyle = "#ffffff"

        ctx.shadowColor = "#7dd3fc"
        ctx.shadowBlur = 15

        ctx.beginPath()
        ctx.arc(sx, sy, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowBlur = 0
      }

      animRef.current =
        requestAnimationFrame(draw)
    }

    animRef.current =
      requestAnimationFrame(draw)

    function getHovered(e) {
      const rect =
        canvas.getBoundingClientRect()

      const mx =
        e.clientX - rect.left

      const my =
        e.clientY - rect.top

      return (
        PLANETS.find(
          (p) =>
            p._x &&
            Math.hypot(
              mx - p._x,
              my - p._y
            ) <
              p.radius *
                zoom.current +
                8
        ) || null
      )
    }

    function onMove(e) {
      if (dragging.current) {
        offset.current.x +=
          e.clientX -
          lastMouse.current.x

        offset.current.y +=
          e.clientY -
          lastMouse.current.y

        lastMouse.current = {
          x: e.clientX,
          y: e.clientY,
        }
      } else {
        const h = getHovered(e)

        setHovered(h)

        canvas.style.cursor = h
          ? "pointer"
          : "grab"
      }
    }

    function onDown(e) {
      dragging.current = true

      lastMouse.current = {
        x: e.clientX,
        y: e.clientY,
      }

      canvas.style.cursor = "grabbing"
    }

    function onUp() {
      dragging.current = false
      canvas.style.cursor = "grab"
    }

    function onWheel(e) {
      e.preventDefault()

      zoom.current = Math.min(
        3,
        Math.max(
          0.35,
          zoom.current -
            e.deltaY * 0.001
        )
      )
    }

    canvas.addEventListener(
      "mousemove",
      onMove
    )

    canvas.addEventListener(
      "mousedown",
      onDown
    )

    canvas.addEventListener(
      "mouseup",
      onUp
    )

    canvas.addEventListener(
      "wheel",
      onWheel,
      { passive: false }
    )

    canvas.addEventListener(
      "click",
      handleClick
    )

    return () => {
      cancelAnimationFrame(
        animRef.current
      )

      canvas.removeEventListener(
        "mousemove",
        onMove
      )

      canvas.removeEventListener(
        "mousedown",
        onDown
      )

      canvas.removeEventListener(
        "mouseup",
        onUp
      )

      canvas.removeEventListener(
        "wheel",
        onWheel
      )

      canvas.removeEventListener(
        "click",
        handleClick
      )
    }
  }, [handleClick, hovered, selected])

  const transferData =
    selected &&
    selected.name !== "Earth"
      ? calculateHohmannTransfer(
          selected
        )
      : null

  return (
    <section
      id="solar-system"
      style={{
        padding: "5rem 0",
        position: "relative",
        background:
          "linear-gradient(180deg, transparent, rgba(2,11,24,0.85), transparent)",
      }}
    >
      <div className="container">
        <span className="section-label">
          Orbital Mechanics Simulation
        </span>

        <h2
          style={{
            fontFamily:
              "'Orbitron', monospace",
            fontSize:
              "clamp(1.8rem, 4vw, 2.8rem)",
            background:
              "linear-gradient(135deg, #fff, #7dd3fc)",
            WebkitBackgroundClip:
              "text",
            WebkitTextFillColor:
              "transparent",
            marginBottom: "0.8rem",
          }}
        >
          Solar System Mission Planner
        </h2>

        <p
          style={{
            color: "#8892a4",
            fontFamily:
              "'Inter', sans-serif",
            marginBottom: "1.5rem",
            fontSize: "0.92rem",
          }}
        >
          Real elliptical orbits ·
          Hohmann transfers ·
          Delta-v calculations ·
          Launch trajectory simulation
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "600px",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            cursor: "grab",
          }}
        />

        {selected && (
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform:
                "translateX(-50%)",
              background:
                "rgba(2,11,24,0.94)",
              border:
                "1px solid rgba(125,211,252,0.25)",
              borderRadius: "16px",
              padding: "1.3rem 2rem",
              minWidth: "360px",
              maxWidth: "92vw",
              backdropFilter:
                "blur(16px)",
              boxShadow:
                "0 0 45px rgba(125,211,252,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: "2rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily:
                      "'Orbitron', monospace",
                    color: "#7dd3fc",
                    fontSize: "0.9rem",
                    letterSpacing:
                      "0.12em",
                    marginBottom:
                      "0.6rem",
                  }}
                >
                  {selected.name.toUpperCase()}
                </p>

                <p
                  style={{
                    color: "#8892a4",
                    marginBottom:
                      "1rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {selected.info}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap:
                      "0.6rem 1.5rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color:
                          "rgba(125,211,252,0.5)",
                        fontSize:
                          "0.58rem",
                      }}
                    >
                      DIAMETER
                    </p>

                    <p
                      style={{
                        color: "#fff",
                      }}
                    >
                      {
                        selected.diameter
                      }
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color:
                          "rgba(125,211,252,0.5)",
                        fontSize:
                          "0.58rem",
                      }}
                    >
                      MOONS
                    </p>

                    <p
                      style={{
                        color: "#fff",
                      }}
                    >
                      {selected.moons}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color:
                          "rgba(125,211,252,0.5)",
                        fontSize:
                          "0.58rem",
                      }}
                    >
                      ECCENTRICITY
                    </p>

                    <p
                      style={{
                        color: "#fff",
                      }}
                    >
                      {
                        selected.eccentricity
                      }
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color:
                          "rgba(125,211,252,0.5)",
                        fontSize:
                          "0.58rem",
                      }}
                    >
                      ORBITAL PERIOD
                    </p>

                    <p
                      style={{
                        color: "#fff",
                      }}
                    >
                      {
                        selected.orbitalPeriodDays
                      }{" "}
                      days
                    </p>
                  </div>

                  {transferData && (
                    <>
                      <div>
                        <p
                          style={{
                            color:
                              "rgba(125,211,252,0.5)",
                            fontSize:
                              "0.58rem",
                          }}
                        >
                          TRANSFER TIME
                        </p>

                        <p
                          style={{
                            color:
                              "#7dd3fc",
                          }}
                        >
                          {
                            transferData.transferDays
                          }{" "}
                          days
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color:
                              "rgba(125,211,252,0.5)",
                            fontSize:
                              "0.58rem",
                          }}
                        >
                          PHASE ANGLE
                        </p>

                        <p
                          style={{
                            color:
                              "#7dd3fc",
                          }}
                        >
                          {
                            transferData.phaseAngle
                          }
                          °
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color:
                              "rgba(125,211,252,0.5)",
                            fontSize:
                              "0.58rem",
                          }}
                        >
                          DEPARTURE ΔV
                        </p>

                        <p
                          style={{
                            color:
                              "#7dd3fc",
                          }}
                        >
                          {
                            transferData.deltaV1
                          }{" "}
                          km/s
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color:
                              "rgba(125,211,252,0.5)",
                            fontSize:
                              "0.58rem",
                          }}
                        >
                          ARRIVAL ΔV
                        </p>

                        <p
                          style={{
                            color:
                              "#7dd3fc",
                          }}
                        >
                          {
                            transferData.deltaV2
                          }{" "}
                          km/s
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelected(null)

                  transferRef.current = {
                    active: false,
                    target: null,
                    progress: 0,
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  color:
                    "rgba(125,211,252,0.6)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}