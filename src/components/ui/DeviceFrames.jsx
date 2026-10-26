import { useContext, useEffect, useRef, useState } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion.js'
import { DeckFrontContext } from './FlickDeck.jsx'

// Minimal device chrome for project screenshots. Both keep the image's aspect ratio
// so nothing reflows while it loads.

// Scroll speed through a full-page screenshot, in rendered px per second, and the bounds on a pass
const SCROLL_SPEED = 420
const SCROLL_MIN = 3.5
const SCROLL_MAX = 9

// vtName: view-transition name shared with the same frame on the project page, so it morphs between them
export function BrowserFrame({ src, full, alt, url, vtName, className = '', priority = false, aspect = 'aspect-[16/10]' }) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] ${className}`}
      style={vtName ? { viewTransitionName: vtName } : undefined}
    >
      <div className="flex h-8 items-center gap-3 border-b border-line px-3 md:h-9">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </span>
        {url && (
          <span className="mx-auto min-w-0 truncate rounded-md bg-page px-3 py-0.5 font-mono text-[10.5px] text-muted md:text-[11px]">
            {url}
          </span>
        )}
        <span aria-hidden="true" className="w-[42px]" />
      </div>
      {full ? (
        <ScrollingShot src={src} full={full} alt={alt} priority={priority} aspect={aspect} />
      ) : (
        <img
          src={src}
          alt={alt}
          width="1440"
          height="900"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className={`block w-full object-cover object-top ${aspect}`}
        />
      )}
    </figure>
  )
}

// The first screen of a site, which scrolls through the whole page: on hover with a mouse, or by
// itself on touch screens once the frame is mostly in view (and is the front card of a deck).
// The full-page image is only fetched the first time it is needed. Its top matches the first-screen
// shot exactly, so swapping one for the other is invisible.
function ScrollingShot({ src, full, alt, priority, aspect }) {
  const reduced = useReducedMotion()
  const isFront = useContext(DeckFrontContext)
  const boxRef = useRef(null)
  const fullRef = useRef(null)
  const [armed, setArmed] = useState(false) // full image requested
  const [loaded, setLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [inView, setInView] = useState(false)
  const [shift, setShift] = useState({ y: 0, duration: 0.7 })

  // Touch screens: watch whether the frame is on screen
  useEffect(() => {
    if (reduced || window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 })
    io.observe(boxRef.current)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    if (inView && isFront) {
      setArmed(true)
      setPlaying(true)
    } else setPlaying(false)
  }, [inView, isFront])

  // Run the pass once both the image is loaded and a play was asked for
  useEffect(() => {
    if (!playing || !loaded) {
      setShift({ y: 0, duration: 0.7 })
      return
    }
    const distance = fullRef.current.offsetHeight - boxRef.current.offsetHeight
    const duration = Math.min(SCROLL_MAX, Math.max(SCROLL_MIN, distance / SCROLL_SPEED))
    setShift({ y: -distance, duration })
  }, [playing, loaded])

  const onEnter = (e) => {
    if (reduced || e.pointerType !== 'mouse') return
    setArmed(true)
    setPlaying(true)
  }
  const onLeave = (e) => e.pointerType === 'mouse' && setPlaying(false)

  return (
    <div ref={boxRef} className={`relative overflow-hidden ${aspect}`} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <img
        src={src}
        alt={alt}
        width="1440"
        height="900"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className="block size-full object-cover object-top"
      />
      {armed && (
        <img
          ref={fullRef}
          src={full}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          // Touch screens have no "leave", so after a beat at the bottom the page glides back to the top
          onTransitionEnd={() => shift.y && inView && setTimeout(() => setPlaying(false), 1200)}
          className="absolute inset-x-0 top-0 block w-full will-change-transform"
          style={{
            opacity: loaded ? 1 : 0,
            transform: `translateY(${shift.y}px)`,
            // Going down: an even glide through the page. Coming back: a quick ease-out to the top.
            transition: `transform ${shift.duration}s ${shift.y ? 'cubic-bezier(0.45, 0, 0.55, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)'}`,
          }}
        />
      )}
    </div>
  )
}

export function PhoneFrame({ src, alt = '', vtName, className = '' }) {
  return (
    <figure
      className={`overflow-hidden rounded-[18%/8.5%] border-[5px] border-[#1c1c1c] bg-black shadow-[0_24px_60px_-12px_rgb(0_0_0/0.9)] ring-1 ring-line md:border-[6px] ${className}`}
      style={vtName ? { viewTransitionName: vtName } : undefined}
    >
      <img
        src={src}
        alt={alt}
        width="390"
        height="844"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block aspect-[390/844] w-full object-cover object-top"
      />
    </figure>
  )
}
