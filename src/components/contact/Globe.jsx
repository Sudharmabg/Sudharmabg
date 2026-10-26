import { useEffect, useRef } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

const N = 1100
const LAT = (12.97 * Math.PI) / 180 // Bengaluru
const LON = (77.59 * Math.PI) / 180

// Evenly spread points on a unit sphere (Fibonacci lattice).
const POINTS = (() => {
  const pts = new Float32Array(N * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const phi = i * golden
    pts[i * 3] = Math.cos(phi) * r
    pts[i * 3 + 1] = y
    pts[i * 3 + 2] = Math.sin(phi) * r
  }
  return pts
})()

const MARKER = [Math.cos(LAT) * Math.sin(LON), Math.sin(LAT), Math.cos(LAT) * Math.cos(LON)]

// A dotted globe that sways around Bengaluru so the lime marker always faces the viewer
// (thinkingods "Particle Globe", without land data). Pauses off-screen; static for reduced motion.
export default function Globe({ className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let running = false

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(0)
    }

    // Rotate around Y (sway) then tilt around X so Bengaluru sits near the centre.
    function project(x, y, z, yaw, tilt) {
      const cy = Math.cos(yaw)
      const sy = Math.sin(yaw)
      const x1 = x * cy + z * sy
      const z1 = -x * sy + z * cy
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)
      return [x1, y * ct - z1 * st, y * st + z1 * ct]
    }

    function draw(t) {
      const R = Math.min(w, h) * 0.42
      const cx = w / 2
      const cy = h / 2
      const yaw = -LON + Math.sin(t * 0.00035) * 0.9
      const tilt = LAT * 0.85

      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(242,242,242,0.07)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()

      for (let i = 0; i < N; i++) {
        const [x, y, z] = project(POINTS[i * 3], POINTS[i * 3 + 1], POINTS[i * 3 + 2], yaw, tilt)
        const depth = (z + 1) / 2 // 0 back … 1 front
        ctx.fillStyle = `rgba(242,242,242,${0.04 + depth * depth * 0.5})`
        ctx.beginPath()
        ctx.arc(cx + x * R, cy - y * R, 0.6 + depth * 0.9, 0, Math.PI * 2)
        ctx.fill()
      }

      const [mx, my, mz] = project(MARKER[0], MARKER[1], MARKER[2], yaw, tilt)
      if (mz > 0) {
        const px = cx + mx * R
        const py = cy - my * R
        const pulse = reduced ? 0.5 : (t % 2200) / 2200
        ctx.strokeStyle = `rgba(198,255,61,${0.7 * (1 - pulse)})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(px, py, 5 + pulse * 18, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = '#C6FF3D'
        ctx.shadowColor = 'rgba(198,255,61,0.8)'
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(px, py, 4.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    function tick(t) {
      draw(t)
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
