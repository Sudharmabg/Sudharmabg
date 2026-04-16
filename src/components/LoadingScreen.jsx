import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const countRef = useRef(null)

  useEffect(() => {
    // Animate counter from 0 to 100 over 2.5s
    const duration = 2500
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = Math.round(eased * 100)
      setCount(val)
      if (progress < 1) {
        countRef.current = requestAnimationFrame(tick)
      } else {
        // Fade out loader
        setTimeout(() => {
          setVisible(false)
          setTimeout(onComplete, 700)
        }, 300)
      }
    }

    countRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(countRef.current)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex flex-col bg-bg overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Top-left label */}
          <div className="absolute top-8 left-10 text-muted text-xs tracking-[0.25em] uppercase font-medium">
            Portfolio
          </div>

          {/* Center radar loader */}
          <div className="flex-1 flex items-center justify-center">
            <div className="radar-loader">
              <span />
              <div className="text-muted font-mono text-xl z-10 opacity-50">
                {String(count).padStart(3, '0')}%
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
