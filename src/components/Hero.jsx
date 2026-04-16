import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'

const ROLES = [
  'AI Engineer',
  'Full Stack Engineer',
  'Backend Specialist',
  'System Designer',
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx(i => (i + 1) % ROLES.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Background accent circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Name */}
        <motion.h1
          variants={item}
          className="font-serif-italic text-5xl md:text-7xl lg:text-8xl mb-4 leading-none tracking-tight"
        >
          Sudharma BG
        </motion.h1>

        {/* Tagline */}
        <motion.div variants={item} className="mb-4">
          <span className="gradient-text font-sans font-light text-xl md:text-2xl tracking-wide">
            Full Stack &amp; AI Engineer
          </span>
        </motion.div>

        {/* Status badge */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-surface border border-stroke text-muted">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for senior roles & consulting
          </span>
        </motion.div>

        {/* Dynamic role line */}
        <motion.div
          layout
          variants={item}
          className="flex items-center justify-center gap-1.5 mb-8 text-muted text-base md:text-lg"
        >
          <span>A</span>
          <div className="relative h-7 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={roleIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="gradient-text font-semibold whitespace-nowrap"
              >
                {ROLES[roleIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
          <span>building in Bengaluru</span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={item}
          className="text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Building scalable backend systems, intelligent applications, and
          AI-driven platforms using Spring Boot, React, and LLM-based architectures.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="projects" smooth duration={600} offset={-80}>
            <button className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Projects
            </button>
          </Link>
          <Link to="contact" smooth duration={600} offset={-80}>
            <button className="btn-outline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Me
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
