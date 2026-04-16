import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'

const NAV_ITEMS = [
  { label: 'Home', to: 'hero' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projects', to: 'projects' },
  { label: 'Experience', to: 'experience' },
  { label: 'Contact', to: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="fixed top-5 left-0 right-0 z-40 flex justify-center pointer-events-none"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
    >
      <nav
        className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.85)'
            : 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid hsl(0 0% 15%)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo */}
        <div className="px-3 py-1 mr-2">
          <span className="gradient-text font-bold text-sm tracking-wider">SBG</span>
        </div>

        {NAV_ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            spy
            smooth
            duration={600}
            offset={-80}
            onSetActive={() => setActive(item.to)}
          >
            <button
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === item.to
                  ? 'text-white'
                  : 'text-muted hover:text-text'
              }`}
              style={{
                background:
                  active === item.to
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))'
                    : 'transparent',
              }}
            >
              {active === item.to && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>
    </motion.header>
  )
}
