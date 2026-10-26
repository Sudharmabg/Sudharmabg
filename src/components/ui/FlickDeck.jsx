import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

// Cards fanned into a 3D deck (thinkingods "Flick Cards Slider"). Drag the front card and it
// follows the pointer, tilting; release past 22% of its width or on a fast flick and it arcs
// away to the back of the deck, otherwise it springs home. Arrows, ←/→ keys and #hash links work too.

const FLICK_DISTANCE = 0.22 // share of card width
const FLICK_VELOCITY = 650 // px/s

// Pose of the cards behind the front one: offset, tilted and smaller, so the deck reads as a stack.
const FAN = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 16, y: 16, rotate: 2.2, scale: 0.955, opacity: 0.75 },
  { x: -16, y: 30, rotate: -2.2, scale: 0.91, opacity: 0.45 },
]
const BURIED = { x: 0, y: 38, rotate: 0, scale: 0.88, opacity: 0 }

const pad = (n) => String(n).padStart(2, '0')

export default function FlickDeck({ items, getId, renderCard, label, heightClass }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i)) // order[0] is the front card
  const flyFront = useRef(null)

  const sendFrontToBack = useCallback(() => setOrder((o) => [...o.slice(1), o[0]]), [])
  const bringBackToFront = useCallback(() => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]), [])

  const next = () => (flyFront.current ? flyFront.current(-1) : sendFrontToBack())
  const prev = () => bringBackToFront()
  const show = (i) => setOrder((o) => [i, ...o.filter((x) => x !== i)])

  // Links like #project-payflow (About's proof pills) bring that card to the front
  useEffect(() => {
    const onHash = () => {
      const i = items.findIndex((it) => `#${getId(it)}` === window.location.hash)
      if (i !== -1) setOrder((o) => [i, ...o.filter((x) => x !== i)])
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [items, getId])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const front = order[0]

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${label}: use the left and right arrow keys to change card`}
        className="relative rounded-3xl pb-10 outline-offset-8 [perspective:1800px]"
      >
        <div className={`relative ${heightClass}`}>
          {order.map((itemIndex, depth) => (
            <DeckCard
              key={getId(items[itemIndex])}
              depth={depth}
              slideLabel={`${itemIndex + 1} of ${items.length}`}
              onGone={sendFrontToBack}
              registerFly={depth === 0 ? (fn) => (flyFront.current = fn) : undefined}
            >
              {renderCard(items[itemIndex], itemIndex)}
            </DeckCard>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted" aria-live="polite">
            <span className="text-ink">{pad(front + 1)}</span> / {pad(items.length)}
          </span>
          <span className="flex gap-1.5">
            {items.map((it, i) => (
              <button
                key={getId(it)}
                type="button"
                onClick={() => show(i)}
                aria-label={`Show card ${i + 1}`}
                aria-current={i === front || undefined}
                className="grid h-6 place-items-center"
              >
                <span className={`block h-1 rounded-full transition-all duration-300 ${i === front ? 'w-6 bg-lime' : 'w-2 bg-line hover:bg-muted'}`} />
              </button>
            ))}
          </span>
          <span className="kicker hidden sm:inline">Drag or flick the card</span>
        </div>
        <div className="flex gap-2">
          <ArrowButton dir="prev" onClick={prev} />
          <ArrowButton dir="next" onClick={next} />
        </div>
      </div>
    </div>
  )
}

function DeckCard({ depth, slideLabel, onGone, registerFly, children }) {
  const reduced = useReducedMotion()
  const isFront = depth === 0
  const x = useMotionValue(0)
  const tilt = useTransform(x, [-500, 0, 500], [-14, 0, 14])
  const cardRef = useRef(null)
  const dragged = useRef(false)

  const fly = useCallback(
    (dir) => {
      if (reduced) return onGone()
      const width = cardRef.current?.offsetWidth ?? 800
      animate(x, dir * width * 1.35, { duration: 0.42, ease: [0.45, 0, 0.75, 0.4] }).then(onGone)
    },
    [reduced, onGone, x],
  )

  useEffect(() => {
    if (isFront && registerFly) registerFly(fly)
  }, [isFront, registerFly, fly])

  // Once it is no longer the front card (flicked to the back), glide it home behind the deck
  useEffect(() => {
    if (!isFront && x.get() !== 0) {
      animate(x, 0, reduced ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 30 })
    }
  }, [isFront, reduced, x])

  const onDragEnd = (_, info) => {
    const width = cardRef.current?.offsetWidth ?? 800
    const far = Math.abs(info.offset.x) > width * FLICK_DISTANCE
    const fast = Math.abs(info.velocity.x) > FLICK_VELOCITY
    if (far || fast) fly(Math.sign(info.offset.x || info.velocity.x) || -1)
    else animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
  }

  return (
    <motion.div
      aria-roledescription="slide"
      aria-label={slideLabel}
      aria-hidden={!isFront || undefined}
      inert={!isFront}
      className="absolute inset-0"
      style={{ zIndex: 50 - depth, transformOrigin: '50% 100%' }}
      initial={false}
      animate={FAN[depth] ?? BURIED}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
    >
      <motion.div
        ref={cardRef}
        className={`h-full ${isFront ? 'cursor-grab select-none active:cursor-grabbing' : ''}`}
        style={{ x, rotate: tilt }}
        drag={isFront ? 'x' : false}
        dragMomentum={false}
        onPointerDown={() => (dragged.current = false)}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={onDragEnd}
        // A drag that ends on a link must not also follow it
        onClickCapture={(e) => {
          if (dragged.current) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function ArrowButton({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous card' : 'Next card'}
      className="grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-lime/60 hover:text-lime"
    >
      <svg viewBox="0 0 16 16" fill="none" className={`size-4 ${dir === 'prev' ? 'rotate-180' : ''}`} aria-hidden="true">
        <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
