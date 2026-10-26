import { useEffect, useRef } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

const INK = [242, 242, 242]
const LIME = [198, 255, 61]

// Near-invisible dot grid that the pointer pulls into a soft singularity (thinkingods "Mesh Flow").
// Canvas 2D with one gaussian; drifts on its own when there is no mouse, freezes for reduced motion.
export default function DotGrid({ className = '' }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let gap = 24
    let cols = 0
    let rows = 0
    let ox = 0
    let oy = 0
    let sigma2 = 1
    let px = new Float32Array(0) // displaced x per point
    let py = new Float32Array(0)
    let pg = new Float32Array(0) // gaussian weight per point

    const pointer = { x: 0, y: 0, active: false }
    const focus = { x: 0, y: 0 }
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

      gap = w < 640 ? 26 : 24
      cols = Math.ceil(w / gap) + 1
      rows = Math.ceil(h / gap) + 1
      ox = (w - (cols - 1) * gap) / 2
      oy = (h - (rows - 1) * gap) / 2
      const sigma = Math.max(90, Math.min(w, h) * 0.16)
      sigma2 = 2 * sigma * sigma

      const n = cols * rows
      px = new Float32Array(n)
      py = new Float32Array(n)
      pg = new Float32Array(n)

      if (!pointer.active) {
        focus.x = w * 0.7
        focus.y = h * 0.42
      }
      draw()
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const pull = 0.42

      // Displace every point toward the focus by a gaussian falloff.
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const x = ox + c * gap
          const y = oy + r * gap
          const dx = focus.x - x
          const dy = focus.y - y
          const g = Math.exp(-(dx * dx + dy * dy) / sigma2)
          px[i] = x + dx * g * pull
          py[i] = y + dy * g * pull
          pg[i] = g
        }
      }

      // Mesh lines appear only where the sheet is bent.
      ctx.lineWidth = 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          if (c + 1 < cols) segment(i, i + 1)
          if (r + 1 < rows) segment(i, i + cols)
        }
      }

      // Far dots share one path; near dots get their own tint and size.
      ctx.fillStyle = `rgba(${INK.join(',')},0.11)`
      ctx.beginPath()
      for (let i = 0; i < pg.length; i++) {
        if (pg[i] >= 0.02) continue
        ctx.moveTo(px[i] + 0.9, py[i])
        ctx.arc(px[i], py[i], 0.9, 0, Math.PI * 2)
      }
      ctx.fill()

      for (let i = 0; i < pg.length; i++) {
        const g = pg[i]
        if (g < 0.02) continue
        const r = Math.round(INK[0] + (LIME[0] - INK[0]) * g)
        const gr = Math.round(INK[1] + (LIME[1] - INK[1]) * g)
        const b = Math.round(INK[2] + (LIME[2] - INK[2]) * g)
        ctx.fillStyle = `rgba(${r},${gr},${b},${0.11 + g * 0.8})`
        ctx.beginPath()
        ctx.arc(px[i], py[i], 0.9 + g * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function segment(a, b) {
      const g = Math.max(pg[a], pg[b])
      if (g < 0.04) return
      ctx.strokeStyle = `rgba(${LIME.join(',')},${g * 0.14})`
      ctx.beginPath()
      ctx.moveTo(px[a], py[a])
      ctx.lineTo(px[b], py[b])
      ctx.stroke()
    }

    function tick(t) {
      let tx = pointer.x
      let ty = pointer.y
      if (!pointer.active) {
        // Slow lissajous drift so the hero is alive without a mouse.
        tx = w * (0.66 + 0.14 * Math.sin(t * 0.00023))
        ty = h * (0.45 + 0.16 * Math.sin(t * 0.00031 + 1.3))
      }
      const ease = pointer.active ? 0.12 : 0.04
      focus.x += (tx - focus.x) * ease
      focus.y += (ty - focus.y) * ease
      draw()
      raf = requestAnimationFrame(tick)
    }

    function start() {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    function onPointerMove(e) {
      if (e.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      pointer.x = x
      pointer.y = y
    }

    function onPointerOut(e) {
      if (!e.relatedTarget) pointer.active = false
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pause when scrolled out of view or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
