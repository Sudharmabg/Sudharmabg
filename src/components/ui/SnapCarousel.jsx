import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

// Native scroll-snap row: swipe on touch, trackpad or arrows on desktop. On phones each slide fills
// the content column, one per screen (the gap matches the gutter, so the neighbours sit just
// off-screen) and a swipe moves exactly one; wider screens show two, then three.
// No mouse drag-to-scroll on purpose: the slides hold their own drag interactions.
export default function SnapCarousel({ label, children, itemClassName = '' }) {
  const reduced = useReducedMotion()
  const track = useRef(null)
  const items = Children.toArray(children)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [thumb, setThumb] = useState(1) // share of the row in view
  const [active, setActive] = useState(0)
  const left = useMotionValue(0)
  const thumbLeft = useTransform(useSpring(left, { stiffness: 400, damping: 40 }), (v) => `${v}%`)

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setThumb(el.clientWidth / el.scrollWidth)
    left.set(max > 0 ? (el.scrollLeft / el.scrollWidth) * 100 : 0)
    const start = el.scrollLeft <= 2
    const end = el.scrollLeft >= max - 2
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }))
    const [a, b] = el.children
    if (a && b) setActive(Math.min(el.children.length - 1, Math.round(el.scrollLeft / (b.offsetLeft - a.offsetLeft))))
  }, [left])

  useEffect(() => {
    update()
    const ro = new ResizeObserver(update)
    ro.observe(track.current)
    return () => ro.disconnect()
  }, [update])

  // One slide per press: the distance between the first two slides is slide width + gap
  const step = (dir) => {
    const el = track.current
    const [a, b] = el.children
    const by = b ? b.offsetLeft - a.offsetLeft : el.clientWidth
    el.scrollBy({ left: dir * by, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        onScroll={update}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto overscroll-x-contain px-5 py-1 scrollbar-none sm:gap-4 md:-mx-10 md:scroll-px-10 md:px-10"
      >
        {items.map((child, i) => (
          <div
            key={child.key ?? i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className={`w-full shrink-0 snap-start snap-always sm:snap-normal sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <p className="font-mono text-[11px] text-muted tabular-nums sm:hidden" aria-hidden="true">
          <span className="text-ink">{String(active + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
        </p>
        <div aria-hidden="true" className="relative h-px flex-1 bg-line">
          <motion.span
            className="absolute -top-px h-[3px] rounded-full bg-lime"
            style={{ width: `${thumb * 100}%`, left: thumbLeft }}
          />
        </div>
        <ArrowButton label="Previous" disabled={edges.start} onClick={() => step(-1)} flip />
        <ArrowButton label="Next" disabled={edges.end} onClick={() => step(1)} />
      </div>
    </div>
  )
}

function ArrowButton({ label, disabled, onClick, flip }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-line text-ink transition-[color,border-color,opacity,scale] hover:border-lime hover:text-lime active:scale-[0.95] active:duration-100 disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 16 16" fill="none" className={`size-4 ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
        <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
