import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

const PAD = 8

// Phrases sit blurred until a bracket frame travels to each one in turn (thinkingods "Focus Reveal").
export default function FocusReveal({ phrases, interval = 2200, className = '' }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [box, setBox] = useState(null)
  const wrapRef = useRef(null)
  const itemRefs = useRef([])

  const measure = useCallback(() => {
    const el = itemRefs.current[active]
    if (!el) return
    setBox({
      x: el.offsetLeft - PAD,
      y: el.offsetTop - PAD / 2,
      width: el.offsetWidth + PAD * 2,
      height: el.offsetHeight + PAD,
    })
  }, [active])

  useLayoutEffect(measure, [measure])

  useEffect(() => {
    const ro = new ResizeObserver(measure)
    ro.observe(wrapRef.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setActive((i) => (i + 1) % phrases.length), interval)
    return () => clearInterval(id)
  }, [reduced, interval, phrases.length])

  return (
    <p ref={wrapRef} className={`relative ${className}`}>
      {phrases.map((phrase, i) => {
        const inFocus = reduced || i === active
        return (
          <span
            key={phrase}
            ref={(el) => (itemRefs.current[i] = el)}
            className="mr-[0.35em] inline-block transition-[filter,opacity] duration-700 ease-out-expo"
            style={inFocus ? undefined : { filter: 'blur(3px)', opacity: 0.3 }}
          >
            {phrase}
          </span>
        )
      })}

      {!reduced && box && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0"
          initial={false}
          animate={box}
          transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
        >
          <Corner className="top-0 left-0 border-t border-l" />
          <Corner className="top-0 right-0 border-t border-r" />
          <Corner className="bottom-0 left-0 border-b border-l" />
          <Corner className="right-0 bottom-0 border-r border-b" />
        </motion.span>
      )}
    </p>
  )
}

function Corner({ className }) {
  return <span className={`absolute size-3 border-lime ${className}`} />
}
