import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useSpring } from 'motion/react'
import { lab } from '../../data/lab.js'
import { Reveal, SectionHeader } from '../ui/bits.jsx'
import useReducedMotion from '../../hooks/useReducedMotion.js'

// 03 Lab: three small, self-contained motion experiments. Each runs only on interaction (nothing
// loops in the background) and falls back to instant moves for reduced motion.
const EXPERIMENTS = { repel: Repel, spring: SpringTuner, easing: EasingRace }

export default function Lab() {
  return (
    <section id="lab" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="03" kicker="Lab" title="Things I" accent="play with" intro={lab.intro} />

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3">
          {lab.experiments.map((ex, i) => {
            const Experiment = EXPERIMENTS[ex.id]
            return (
              <Reveal key={ex.id} delay={i * 0.06} as="article" className="flex flex-col rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">
                    <span className="mr-2 font-mono text-xs font-normal text-muted">L{String(i + 1).padStart(2, '0')}</span>
                    {ex.title}
                  </h3>
                  <span className="kicker text-right">{ex.hint}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{ex.note}</p>
                <div className="mt-5 flex-1">
                  <Experiment {...ex} />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const stage = 'relative h-56 overflow-hidden rounded-xl border border-line bg-page'
const dots = { backgroundImage: 'radial-gradient(rgb(242 242 242 / 0.06) 1px, transparent 1px)', backgroundSize: '16px 16px' }

// L01 — each letter is pushed away from the pointer, harder the closer it is, and springs home.
const REPEL_RADIUS = 150 // px of influence around the pointer
const REPEL_PUSH = 34 // px a letter moves when the pointer is right on it

function Repel({ word }) {
  const reduced = useReducedMotion()
  const [pointer, setPointer] = useState(null)

  const onMove = (e) => setPointer({ x: e.clientX, y: e.clientY })

  return (
    <div
      className={`${stage} grid touch-pan-y place-items-center`}
      style={dots}
      onPointerMove={reduced ? undefined : onMove}
      onPointerLeave={() => setPointer(null)}
    >
      <p aria-label={word} className="flex font-display text-[clamp(3.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.02em]">
        {[...word].map((ch, i) => (
          <RepelLetter key={i} ch={ch} pointer={pointer} />
        ))}
      </p>
    </div>
  )
}

const REPEL_SPRING = { stiffness: 320, damping: 18, mass: 0.6 }

function RepelLetter({ ch, pointer }) {
  const ref = useRef(null)
  const x = useSpring(0, REPEL_SPRING)
  const y = useSpring(0, REPEL_SPRING)
  const rotate = useSpring(0, REPEL_SPRING)

  // New target on every pointer move; the springs smooth the jumps between events
  useEffect(() => {
    let dx = 0
    let dy = 0
    if (pointer) {
      const r = ref.current.getBoundingClientRect()
      // Rest position: the measured box includes the current offset, so take it back out
      const vx = r.left + r.width / 2 - x.get() - pointer.x
      const vy = r.top + r.height / 2 - y.get() - pointer.y
      const dist = Math.hypot(vx, vy) || 1
      const force = Math.max(0, 1 - dist / REPEL_RADIUS) ** 2 * REPEL_PUSH
      dx = (vx / dist) * force
      dy = (vy / dist) * force
    }
    x.set(dx)
    y.set(dy)
    rotate.set(dx * 0.6)
  }, [pointer, x, y, rotate])

  return (
    <motion.span
      aria-hidden="true"
      ref={ref}
      style={{ x, y, rotate }}
      className="inline-block transition-colors duration-300 hover:text-lime"
    >
      {ch}
    </motion.span>
  )
}

// L02 — click to send the block there; the sliders change the spring it travels on.
function SpringTuner() {
  const reduced = useReducedMotion()
  const box = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [stiffness, setStiffness] = useState(260)
  const [damping, setDamping] = useState(14)

  const send = (e) => {
    const r = box.current.getBoundingClientRect()
    const to = (v, size) => Math.min(size - 28, Math.max(28, v)) - size / 2
    const opts = reduced ? { duration: 0 } : { type: 'spring', stiffness, damping }
    animate(x, to(e.clientX - r.left, r.width), opts)
    animate(y, to(e.clientY - r.top, r.height), opts)
  }

  return (
    <div>
      <div ref={box} className={`${stage} cursor-crosshair`} style={dots} onPointerDown={send}>
        <motion.span
          aria-hidden="true"
          style={{ x, y }}
          className="absolute top-1/2 left-1/2 -mt-5 -ml-5 size-10 rounded-lg bg-lime shadow-[0_0_30px_-4px_rgb(198_255_61/0.6)]"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Slider label="Stiffness" value={stiffness} min={40} max={700} step={10} onChange={setStiffness} />
        <Slider label="Damping" value={damping} min={4} max={60} step={1} onChange={setDamping} />
      </div>
    </div>
  )
}

function Slider({ label, value, onChange, ...range }) {
  return (
    <label className="block">
      <span className="flex justify-between font-mono text-[11px] text-muted">
        {label} <span className="text-ink tabular-nums">{value}</span>
      </span>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        {...range}
        className="mt-2 h-6 w-full cursor-pointer accent-lime"
      />
    </label>
  )
}

// L03 — the same 1.1s trip on four curves, side by side.
const RACERS = [
  { name: 'linear', ease: 'linear' },
  { name: 'ease-in-out', ease: [0.42, 0, 0.58, 1] },
  { name: 'ease-out expo', ease: [0.16, 1, 0.3, 1] },
  { name: 'spring', spring: { type: 'spring', stiffness: 170, damping: 16 } },
]

function EasingRace() {
  const reduced = useReducedMotion()
  const track = useRef(null)
  const [atEnd, setAtEnd] = useState(false)

  return (
    <div>
      <div ref={track} className={`${stage} flex flex-col justify-around px-4 py-3`} style={dots}>
        {RACERS.map((r) => (
          <Racer key={r.name} racer={r} atEnd={atEnd} reduced={reduced} track={track} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setAtEnd((v) => !v)}
        className="mt-4 inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm transition-[color,border-color,scale] hover:border-lime hover:text-lime active:scale-[0.97] active:duration-100"
      >
        {atEnd ? 'Race back' : 'Race'}
      </button>
    </div>
  )
}

function Racer({ racer, atEnd, reduced, track }) {
  const width = track.current ? track.current.clientWidth - 32 - 14 : 0
  const transition = reduced ? { duration: 0 } : (racer.spring ?? { duration: 1.1, ease: racer.ease })
  return (
    <div className="relative">
      <span className="font-mono text-[10.5px] text-muted">{racer.name}</span>
      <div className="relative mt-1 h-px bg-line">
        <motion.span
          aria-hidden="true"
          className="absolute -top-[7px] left-0 size-3.5 rounded-full bg-lime"
          animate={{ x: atEnd ? width : 0 }}
          transition={transition}
        />
      </div>
    </div>
  )
}
