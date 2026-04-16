import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Link, animateScroll as scroll, scroller } from 'react-scroll'

const SECTIONS = ['hero', 'skills', 'projects', 'experience', 'contact']

export default function ScrollBadge() {
  const { scrollYProgress } = useScroll()
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2
      const sectionElements = SECTIONS.map(id => document.getElementById(id))
      
      const newIdx = sectionElements.findIndex((el, idx) => {
        if (!el) return false
        const nextEl = sectionElements[idx + 1]
        if (!nextEl) return true
        return scrollPos >= el.offsetTop && scrollPos < nextEl.offsetTop
      })

      if (newIdx !== -1) setCurrentSection(newIdx)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNext = () => {
    const nextIdx = (currentSection + 1)
    if (nextIdx < SECTIONS.length) {
      scroller.scrollTo(SECTIONS[nextIdx], {
        duration: 800,
        smooth: 'easeInOutQuart',
        offset: -80
      })
    } else {
      scroll.scrollToTop()
    }
  }

  return (
    <motion.div
      className="fixed bottom-10 right-10 z-50 cursor-pointer group hidden md:flex"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleNext}
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Progress Circle Background */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-stroke fill-none"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-purple-500 fill-none"
            strokeWidth="2"
            style={{ pathLength }}
            strokeLinecap="round"
          />
        </svg>

        {/* Rotating text circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 scale-[0.85]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-muted text-[10px] tracking-[0.2em] font-medium uppercase">
            <path
              id="globalTextPath"
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              fill="none"
            />
            <text>
              <textPath href="#globalTextPath">
                Explore • Scroll • Explore • Scroll •
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Central Arrow Pill */}
        <div className="relative z-10 w-9 h-9 rounded-full bg-surface border border-stroke flex items-center justify-center shadow-2xl group-hover:border-purple-500/50 transition-colors">
          <motion.div
            animate={currentSection === SECTIONS.length - 1 ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
