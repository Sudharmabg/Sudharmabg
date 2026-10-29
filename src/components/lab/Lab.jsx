import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { lab } from '../../data/lab.js'
import { Reveal, SectionHeader } from '../ui/bits.jsx'
import { CheckIcon, PlaneIcon } from '../ui/icons.jsx'
import SnapCarousel from '../ui/SnapCarousel.jsx'
import useReducedMotion from '../../hooks/useReducedMotion.js'

// 03 Lab: small, self-contained motion experiments in a swipeable row. Each runs only on
// interaction (nothing loops in the background) and falls back to instant moves for reduced motion.
const EXPERIMENTS = { repel: Repel, spring: SpringTuner, easing: EasingRace, hold: HoldToConfirm, fling: Fling, morph: MorphButton }

export default function Lab() {
  return (
    <section id="lab" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="03" kicker="Lab" title="Things I" accent="play with" intro={lab.intro} />

        <Reveal className="mt-12 md:mt-16">
          <SnapCarousel label="Lab experiments">
            {lab.experiments.map((ex, i) => {
              const Experiment = EXPERIMENTS[ex.id]
              return (
                <article key={ex.id} className="flex h-full flex-col rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">
                    <span className="mr-2 font-mono text-xs font-normal text-muted">L{String(i + 1).padStart(2, '0')}</span>
                    {ex.title}
                  </h3>
                  <span className="kicker text-right">
                    {ex.touchHint ? (
                      <>
                        <span className="pointer-coarse:hidden">{ex.hint}</span>
                        <span className="hidden pointer-coarse:inline">{ex.touchHint}</span>
                      </>
                    ) : (
                      ex.hint
                    )}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{ex.note}</p>
                <div className="mt-5 flex-1">
                  <Experiment {...ex} />
                </div>
              </article>
            )
          })}
          </SnapCarousel>
        </Reveal>
      </div>
    </section>
  )
}

const stage = 'relative h-56 overflow-hidden rounded-xl border border-line bg-page'
const dots = { backgroundImage: 'radial-gradient(rgb(242 242 242 / 0.06) 1px, transparent 1px)', backgroundSize: '16px 16px' }

// L01 — each letter is pushed away from the pointer, harder the closer it is, and springs home.
// Radius and push scale with the stage, so a phone-width card isn't one big repel zone.
const REPEL_RADIUS = 150 // px of influence around the pointer, at full width
const REPEL_PUSH = 34 // px a letter moves when the pointer is right on it, at full width
const REPEL_FULL_WIDTH = 420

function Repel({ word }) {
  const reduced = useReducedMotion()
  const [pointer, setPointer] = useState(null)

  const onMove = (e) => {
    const scale = Math.min(1, e.currentTarget.offsetWidth / REPEL_FULL_WIDTH)
    setPointer({ x: e.clientX, y: e.clientY, radius: REPEL_RADIUS * scale, push: REPEL_PUSH * Math.max(scale, 0.75) })
  }

  // Touch: a tap shoves the letters from that spot, and they spring home on release.
  // Only the word itself captures the finger (touch-none); the rest of the card still scrolls the page.
  return (
    <div
      className={`${stage} grid place-items-center`}
      style={dots}
      onPointerMove={reduced ? undefined : onMove}
      onPointerDown={reduced ? undefined : (e) => e.pointerType !== 'mouse' && onMove(e)}
      onPointerUp={(e) => e.pointerType !== 'mouse' && setPointer(null)}
      onPointerCancel={() => setPointer(null)}
      onPointerLeave={() => setPointer(null)}
    >
      <p
        aria-label={word}
        className="flex touch-none px-4 py-6 font-display text-[clamp(3.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.02em] select-none"
      >
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
      const force = Math.max(0, 1 - dist / pointer.radius) ** 2 * pointer.push
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

// L04 — hold to fill; the fill runs slow and linear (a clock), the release snaps back fast.
const HOLD_SECONDS = 1.5
const SNAP_BACK = { duration: 0.2, ease: [0.23, 1, 0.32, 1] }

function HoldToConfirm() {
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const clip = useTransform(progress, (p) => `inset(0 ${100 - p * 100}% 0 0)`)
  const percent = useTransform(progress, (p) => `${Math.round(p * 100)}%`)
  const [done, setDone] = useState(false)
  const anim = useRef(null)
  const timer = useRef(null)

  useEffect(
    () => () => {
      anim.current?.stop()
      clearTimeout(timer.current)
    },
    [],
  )

  const start = () => {
    if (done) return
    anim.current?.stop()
    anim.current = animate(progress, 1, {
      duration: HOLD_SECONDS * (1 - progress.get()),
      ease: 'linear',
      onComplete: () => {
        setDone(true)
        timer.current = setTimeout(() => {
          setDone(false)
          anim.current = animate(progress, 0, { duration: 0.35 })
        }, 1800)
      },
    })
  }

  const release = () => {
    if (done) return
    anim.current?.stop()
    anim.current = animate(progress, 0, reduced ? { duration: 0 } : SNAP_BACK)
  }

  const isKey = (e) => e.key === ' ' || e.key === 'Enter'
  const content = done ? (
    <>
      <CheckIcon className="size-4" /> Deleted
    </>
  ) : (
    'Hold to delete'
  )

  return (
    <div>
      <div className={`${stage} grid place-items-center`} style={dots}>
        <motion.button
          type="button"
          aria-label={done ? 'Deleted' : `Hold to delete, ${HOLD_SECONDS} seconds`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId)
            start()
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(e) => {
            if (isKey(e) && !e.repeat) {
              e.preventDefault()
              start()
            }
          }}
          onKeyUp={(e) => isKey(e) && release()}
          onBlur={release}
          onContextMenu={(e) => e.preventDefault()}
          animate={done && !reduced ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="relative min-h-12 touch-none overflow-hidden rounded-full border border-line bg-page px-7 font-medium select-none [-webkit-touch-callout:none]"
        >
          <span className="flex items-center gap-2 text-ink">{content}</span>
          <motion.span
            aria-hidden="true"
            style={{ clipPath: clip }}
            className="absolute inset-0 flex items-center justify-center gap-2 bg-lime text-page"
          >
            {content}
          </motion.span>
        </motion.button>
      </div>
      <p className="mt-4 flex justify-between font-mono text-[11px] text-muted">
        <span>in {HOLD_SECONDS}s linear · out 0.2s ease-out</span>
        <motion.span className="text-ink tabular-nums">{percent}</motion.span>
      </p>
    </div>
  )
}

// L05 — throw the front card. It goes if the drag was fast at the end, or if it was pulled past
// the guide line. Speed is the peak of the last 150ms, not the release instant: trackpad users
// slow down before they let go. Mice and trackpads get a lower bar than fingers. Vertical rubber-bands.
const FLING_VELOCITY = { touch: 500, mouse: 280 } // px/s
const FLING_DISTANCE = 0.3 // share of stage width, either side of centre
const VELOCITY_WINDOW = 150 // ms
const FLING_CARDS = [
  { n: '01', t: 'Throw me' },
  { n: '02', t: 'Faster' },
  { n: '03', t: 'Sideways' },
  { n: '04', t: 'Once more' },
]
const STACK = [
  { scale: 1, y: 0, opacity: 1 },
  { scale: 0.93, y: 12, opacity: 0.6 },
  { scale: 0.86, y: 24, opacity: 0.3 },
]

function Fling() {
  const reduced = useReducedMotion()
  const box = useRef(null)
  const [order, setOrder] = useState(() => FLING_CARDS.map((_, i) => i))
  const [last, setLast] = useState(null)
  const [drag, setDrag] = useState(null) // null | { armed }

  const toBack = () => setOrder((o) => [...o.slice(1), o[0]])

  return (
    <div>
      <div ref={box} className={stage} style={dots}>
        {/* Guide lines: past either one, letting go throws the card */}
        {['left', 'right'].map((side) => (
          <span
            key={side}
            aria-hidden="true"
            className={`absolute inset-y-4 border-l border-dashed transition-[opacity,border-color] duration-200 ${
              drag ? 'opacity-100' : 'opacity-0'
            } ${drag?.armed ? 'border-lime/70' : 'border-ink/20'}`}
            style={{ [side]: `${(0.5 - FLING_DISTANCE) * 100}%` }}
          />
        ))}
        {order.map((cardIndex, depth) => (
          <motion.div
            key={cardIndex}
            className="pointer-events-none absolute inset-0 grid place-items-center"
            style={{ zIndex: FLING_CARDS.length - depth }}
            initial={false}
            animate={STACK[depth] ?? { ...STACK[2], opacity: 0 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', duration: 0.45, bounce: 0.15 }}
          >
            <FlingCard
              card={FLING_CARDS[cardIndex]}
              front={depth === 0}
              armed={depth === 0 && !!drag?.armed}
              box={box}
              reduced={reduced}
              onRelease={(r) => {
                setLast(r)
                setDrag(null)
              }}
              onDragState={setDrag}
              onFlung={toBack}
            />
          </motion.div>
        ))}
      </div>
      <p className="mt-4 flex justify-between gap-3 font-mono text-[11px] text-muted">
        <span>flick it, or drag past the line</span>
        {last && (
          <span className={last.flung ? 'text-lime' : 'text-ink'}>
            {last.flung ? 'flung' : 'too slow'} · <span className="tabular-nums">{last.v}</span> px/s
            {last.by === 'distance' && ' · past the line'}
          </span>
        )}
      </p>
    </div>
  )
}

function FlingCard({ card, front, armed, box, reduced, onRelease, onDragState, onFlung }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const fade = useMotionValue(1)
  const rotate = useTransform(x, [-220, 220], [-14, 14])
  const samples = useRef([]) // recent { t, vx } while dragging
  const isArmed = useRef(false)

  const fling = async (velocity) => {
    const dir = Math.sign(velocity) || 1
    if (!reduced) await animate(x, dir * (box.current.offsetWidth * 0.75 + 80), { duration: 0.3, ease: [0.23, 1, 0.32, 1] })
    // Off-stage: reset quietly, then fade back in at the bottom of the stack
    fade.set(0)
    x.set(0)
    y.set(0)
    onFlung()
    animate(fade, 1, { duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.15 })
  }

  // Fastest horizontal speed in the recent window, keeping its sign
  const peakVelocity = (now) => {
    let peak = 0
    for (const s of samples.current) if (now - s.t <= VELOCITY_WINDOW && Math.abs(s.vx) > Math.abs(peak)) peak = s.vx
    return peak
  }

  const verdict = (e, info) => {
    const now = performance.now()
    const v = peakVelocity(now)
    const bar = e?.pointerType === 'touch' ? FLING_VELOCITY.touch : FLING_VELOCITY.mouse
    const past = Math.abs(info.offset.x) > box.current.offsetWidth * FLING_DISTANCE
    const fast = Math.abs(v) > bar
    return { v, past, fast }
  }

  const onDragStart = () => {
    samples.current = []
    isArmed.current = false
    onDragState({ armed: false })
  }

  const onDrag = (e, info) => {
    const now = performance.now()
    samples.current = [...samples.current.filter((s) => now - s.t <= VELOCITY_WINDOW), { t: now, vx: info.velocity.x }]
    const { past, fast } = verdict(e, info)
    const next = past || fast
    if (next !== isArmed.current) {
      isArmed.current = next
      onDragState({ armed: next })
    }
  }

  const onDragEnd = (e, info) => {
    const { v, past, fast } = verdict(e, info)
    const flung = past || fast
    onRelease({ v: Math.round(Math.abs(v)), flung, by: fast ? 'speed' : past ? 'distance' : null })
    animate(y, 0, { type: 'spring', duration: 0.4, bounce: 0.2 })
    // Thrown by distance alone: go the way it was pulled, even if the last nudge went back
    if (flung) fling(fast ? v : info.offset.x)
    else animate(x, 0, { type: 'spring', duration: 0.5, bounce: 0.25 })
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      onRelease({ v: 1000, flung: true })
      fling(e.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return (
    <motion.div
      drag={front}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.12, bottom: 0.12 }}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onKeyDown={front ? onKeyDown : undefined}
      tabIndex={front ? 0 : -1}
      aria-label={front ? `${card.t}. Use the left and right arrow keys to throw` : undefined}
      aria-hidden={front ? undefined : true}
      style={{ x, y, rotate, opacity: fade }}
      whileDrag={{ scale: 1.04 }}
      className={`flex h-36 w-28 flex-col justify-between rounded-xl border bg-surface transition-[border-color] duration-200 ${
        armed ? 'border-lime/70' : 'border-line'
      } p-3 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)] select-none ${
        front ? 'pointer-events-auto cursor-grab touch-none active:cursor-grabbing' : ''
      }`}
    >
      <span className="font-mono text-[11px] text-lime">{card.n}</span>
      <span className="font-display text-lg leading-tight font-semibold">{card.t}</span>
    </motion.div>
  )
}

// L06 — idle → loading → success → idle. Width follows the measured content; the label swaps
// with a short blur-fade while the shell reshapes. "Slow motion" stretches every duration 4×.
function MorphButton() {
  const reduced = useReducedMotion()
  const [state, setState] = useState('idle')
  const [slow, setSlow] = useState(false)
  const k = slow ? 4 : 1
  const [inner, width] = useWidth()

  useEffect(() => {
    if (state === 'idle') return
    const next = state === 'loading' ? 'success' : 'idle'
    const id = setTimeout(() => setState(next), (state === 'loading' ? 1400 : 1600) * k)
    return () => clearTimeout(id)
  }, [state, k])

  const shell = reduced ? { duration: 0 } : { type: 'spring', duration: 0.5 * k, bounce: 0.15 }
  const swap = reduced ? { duration: 0 } : { duration: 0.25 * k, ease: [0.23, 1, 0.32, 1] }
  const tone = {
    idle: 'bg-ink text-page',
    loading: 'bg-surface text-lime ring-1 ring-line',
    success: 'bg-lime text-page',
  }[state]

  return (
    <div>
      <div className={`${stage} grid place-items-center`} style={dots}>
        <motion.button
          type="button"
          onClick={() => state === 'idle' && setState('loading')}
          aria-disabled={state !== 'idle'}
          animate={width ? { width } : undefined}
          transition={shell}
          className={`relative flex h-12 items-center justify-center overflow-hidden rounded-full font-medium transition-[background-color,color,box-shadow,scale] active:scale-[0.97] active:duration-100 ${tone}`}
          style={{ transitionDuration: `${300 * k}ms` }}
        >
          <span ref={inner} className="inline-flex w-max">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={state}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={swap}
                className={`flex items-center gap-2 whitespace-nowrap ${state === 'loading' ? 'px-3.5' : 'px-6'}`}
              >
                {state === 'idle' && (
                  <>
                    <PlaneIcon /> Send message
                  </>
                )}
                {state === 'loading' && (
                  <span
                    className="block size-5 rounded-full border-2 border-lime/25 border-t-lime"
                    style={{ animation: `ring-spin ${0.7 * k}s linear infinite` }}
                  />
                )}
                {state === 'success' && (
                  <>
                    <CheckIcon /> Sent
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>
        <span className="sr-only" aria-live="polite">
          {state === 'loading' ? 'Sending' : state === 'success' ? 'Sent' : ''}
        </span>
      </div>
      <button
        type="button"
        aria-pressed={slow}
        onClick={() => setSlow((v) => !v)}
        className={`mt-4 inline-flex min-h-11 items-center rounded-full border px-5 text-sm transition-[color,border-color,scale] active:scale-[0.97] active:duration-100 ${
          slow ? 'border-lime/50 text-lime' : 'border-line hover:border-lime hover:text-lime'
        }`}
      >
        Slow motion {slow ? 'on' : 'off'}
      </button>
    </div>
  )
}

// Width of an element, kept current with a ResizeObserver
function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    setWidth(el.offsetWidth)
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}
