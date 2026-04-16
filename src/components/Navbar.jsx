import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'

const NAV_ITEMS = [
  { label: 'Home', to: 'hero' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projects', to: 'projects' },
  { label: 'Experience', to: 'experience' },
  { label: 'Contact', to: 'contact' },
]

const glassStyle = (scrolled) => ({
  background: scrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0.6)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid hsl(0 0% 15%)',
  boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
})

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <motion.header
      className="fixed top-5 left-0 right-0 z-40 flex justify-center pointer-events-none px-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
    >
      {/* ── Desktop pill (md+) ── */}
      <nav
        className="pointer-events-auto hidden md:flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300"
        style={glassStyle(scrolled)}
      >
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
                active === item.to ? 'text-white' : 'text-muted hover:text-text'
              }`}
              style={{
                background: active === item.to
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

      {/* ── Mobile bar (< md) ── */}
      <div className="pointer-events-auto md:hidden w-full" ref={menuRef}>
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-300"
          style={glassStyle(scrolled)}
        >
          <span className="gradient-text font-bold text-sm tracking-wider">SBG</span>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="text-muted hover:text-text transition-colors p-1"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={menuOpen ? 'open' : 'closed'}
              className="w-5 h-4 flex flex-col justify-between"
            >
              <motion.span
                className="block h-0.5 bg-current rounded-full origin-center"
                variants={{ open: { rotate: 45, y: 7.5 }, closed: { rotate: 0, y: 0 } }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block h-0.5 bg-current rounded-full"
                variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 bg-current rounded-full origin-center"
                variants={{ open: { rotate: -45, y: -7.5 }, closed: { rotate: 0, y: 0 } }}
                transition={{ duration: 0.25 }}
              />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-2 rounded-2xl overflow-hidden"
              style={glassStyle(true)}
            >
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  spy
                  smooth
                  duration={600}
                  offset={-80}
                  onSetActive={() => setActive(item.to)}
                  onClick={handleNavClick}
                >
                  <button
                    className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors duration-150 ${
                      active === item.to
                        ? 'text-white'
                        : 'text-muted hover:text-text'
                    }`}
                    style={{
                      background: active === item.to
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))'
                        : 'transparent',
                      borderLeft: active === item.to ? '2px solid rgba(139,92,246,0.6)' : '2px solid transparent',
                    }}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
