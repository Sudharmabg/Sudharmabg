import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import useReducedMotion from '../../hooks/useReducedMotion.js'

// Context label that trails the pointer over anything marked data-cursor="…" ("View", "Drag",
// "Next"). It sits beside the system cursor rather than replacing it, so pointing stays precise.
// Mouse and trackpad only: touch screens have no pointer to follow, so nothing renders there.
const OFFSET = 18 // px right of and below the pointer tip

export default function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // A light spring so the label trails the pointer instead of being glued to it
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setEnabled(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX + OFFSET)
      y.set(e.clientY + OFFSET)
      setLabel(e.target.closest?.('[data-cursor]')?.dataset.cursor ?? null)
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x: reduced ? x : sx, y: reduced ? y : sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 block origin-top-left rounded-full bg-lime px-3 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.14em] whitespace-nowrap text-page uppercase shadow-[0_8px_24px_-6px_rgb(198_255_61/0.45)]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
