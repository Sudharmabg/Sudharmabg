import { useRef } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

const EASE = [0.16, 1, 0.3, 1]

// Shapes in a 600×500 box. `accent` strokes lime; `label` is mono text that fades in.
const rect = (x, y, w, h, extra) => ({ t: 'rect', x, y, w, h, ...extra })
const path = (d, extra) => ({ t: 'path', d, ...extra })
const dot = (cx, cy, r = 4, extra) => ({ t: 'circle', cx, cy, r, ...extra })
const label = (x, y, s) => ({ t: 'text', x, y, s })

// Deterministic scatter so the prerendered and client markup match
function cluster(cx, cy, n, spread, seed) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: n }, () => {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * spread
    return [Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d)]
  })
}

const near = cluster(390, 300, 12, 70, 7)

const SCHEMATICS = {
  // API fanning out to services, a database behind them, all on one event bus
  Backend: [
    path('M30 40 H570', { accent: true }),
    label(30, 26, 'kafka'),
    rect(30, 230, 120, 80),
    label(46, 276, 'api'),
    path('M90 230 V40'),
    rect(240, 80, 120, 80),
    rect(240, 230, 120, 80),
    rect(240, 380, 120, 80),
    label(256, 126, 'svc.auth'),
    label(256, 276, 'svc.pay'),
    label(256, 426, 'svc.notify'),
    path('M300 80 V40'),
    path('M150 270 H195 V120 H240'),
    path('M150 270 H240'),
    path('M150 270 H195 V420 H240'),
    path('M360 120 H405 V270 H450'),
    path('M360 270 H450'),
    path('M360 420 H405 V270'),
    path('M450 240 a60 14 0 0 1 120 0 V300 a60 14 0 0 1 -120 0 Z'),
    path('M450 240 a60 14 0 0 0 120 0'),
    label(476, 282, 'postgres'),
    path('M510 226 V40'),
  ],

  // Embeddings in clusters; a query pulls its nearest neighbours (retrieval)
  'AI & LLM': [
    ...cluster(140, 140, 14, 70, 3).map(([x, y]) => dot(x, y, 3)),
    ...cluster(160, 380, 12, 65, 11).map(([x, y]) => dot(x, y, 3)),
    ...near.map(([x, y]) => dot(x, y, 3.5)),
    path('M390 300 m-110 0 a110 110 0 1 0 220 0 a110 110 0 1 0 -220 0', { dashed: true }),
    ...near.slice(0, 5).map(([x, y]) => path(`M470 150 L${x} ${y}`)),
    dot(470, 150, 7, { accent: true }),
    path('M470 150 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0', { accent: true }),
    label(492, 140, 'query'),
    label(330, 432, 'top-k'),
  ],

  // A page wireframe: chrome, nav, hero, cards
  Frontend: [
    rect(30, 30, 540, 440, { r: 12 }),
    path('M30 72 H570'),
    dot(56, 51, 5),
    dot(76, 51, 5),
    dot(96, 51, 5),
    rect(60, 96, 70, 14, { r: 7 }),
    path('M370 103 H410 M430 103 H470 M490 103 H530'),
    path('M60 160 H380'),
    path('M60 196 H320'),
    path('M60 232 H260'),
    rect(60, 262, 120, 36, { r: 18, accent: true }),
    rect(410, 150, 130, 150, { r: 8 }),
    rect(60, 330, 150, 110, { r: 8 }),
    rect(225, 330, 150, 110, { r: 8 }),
    rect(390, 330, 150, 110, { r: 8 }),
    label(84, 286, 'cta'),
  ],

  // Commit → build → test → deploy, fanning out to containers
  'Cloud & DevOps': [
    path('M70 250 H430'),
    dot(70, 250, 16),
    dot(190, 250, 16),
    dot(310, 250, 16),
    dot(430, 250, 16, { accent: true }),
    label(44, 296, 'commit'),
    label(170, 296, 'build'),
    label(293, 296, 'test'),
    label(404, 296, 'deploy'),
    path('M446 250 C500 250 480 110 520 110'),
    path('M446 250 H520'),
    path('M446 250 C500 250 480 390 520 390'),
    rect(520, 80, 60, 60, { r: 6 }),
    rect(520, 220, 60, 60, { r: 6 }),
    rect(520, 360, 60, 60, { r: 6 }),
    path('M70 160 V234 M70 266 V340', { dashed: true }),
    label(44, 140, 'git push'),
  ],
}

// A faint line drawing for the open expertise row. It draws itself in stroke by stroke and
// cross-fades when another row opens. Decorative, so hidden from assistive tech.
export default function Schematic({ name, index, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()
  const shapes = SCHEMATICS[name]

  return (
    <figure ref={ref} aria-hidden="true" className={className}>
      <div className="relative aspect-[6/5]">
        <AnimatePresence initial={false}>
          {inView && shapes && (
            <motion.svg
              key={name}
              viewBox="0 0 600 500"
              fill="none"
              className="absolute inset-0 size-full"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              {shapes.map((s, i) => (
                <Shape key={i} s={s} delay={reduced ? 0 : i * 0.035} reduced={reduced} />
              ))}
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      <figcaption className="mt-3 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
        {shapes ? (
          <>
            <span className="text-lime">fig. {String(index + 1).padStart(2, '0')}</span> — {name}
          </>
        ) : (
          ' '
        )}
      </figcaption>
    </figure>
  )
}

function Shape({ s, delay, reduced }) {
  const transition = reduced ? { duration: 0 } : { duration: 0.9, ease: EASE, delay }

  if (s.t === 'text') {
    return (
      <motion.text
        x={s.x}
        y={s.y}
        className="fill-ink/30 font-mono text-[15px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition, delay: reduced ? 0 : delay + 0.3 }}
      >
        {s.s}
      </motion.text>
    )
  }

  const stroke = s.accent ? 'stroke-lime/70' : 'stroke-ink/20'
  const common = {
    className: stroke,
    strokeWidth: 1.25,
    strokeDasharray: s.dashed ? '4 6' : undefined,
    initial: s.dashed ? { opacity: 0 } : { pathLength: 0, opacity: 0 },
    animate: s.dashed ? { opacity: 1 } : { pathLength: 1, opacity: 1 },
    transition,
  }

  if (s.t === 'rect') return <motion.rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r ?? 4} {...common} />
  if (s.t === 'circle') return <motion.circle cx={s.cx} cy={s.cy} r={s.r} {...common} />
  return <motion.path d={s.d} strokeLinecap="round" {...common} />
}
