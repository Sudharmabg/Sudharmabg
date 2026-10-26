import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { navLinks, profile } from '../data/profile.js'
import { ArrowUpRight, MenuIcon } from './ui/icons.jsx'
import Logo from './ui/Logo.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] transition-colors duration-300 ${
        solid ? 'border-line bg-page/75 backdrop-blur-md' : 'border-transparent'
      }`}
    >
      <nav className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10" aria-label="Primary">
        <Logo />

        {/* Frosted pill, centred on the page; a highlight slides to whichever link is hovered or focused */}
        <ul
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-line bg-surface/70 p-1 backdrop-blur-md md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              {hovered === link.href && (
                <motion.span
                  layoutId="nav-hover"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-ink/10"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <a
                href={`/${link.href}`}
                // Mouse only: a tap on a tablet would leave the highlight stuck on the tapped link
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(link.href)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
                className="relative block rounded-full px-4 py-2 text-sm text-ink/80 transition-colors duration-200 hover:text-ink focus-visible:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] transition-colors hover:border-lime hover:text-lime sm:inline-flex"
          >
            Resume <ArrowUpRight className="size-3.5" />
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line transition-transform duration-100 active:scale-[0.94] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden border-t border-line bg-page md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col px-5 py-6">
              {navLinks.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={`/${link.href}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3 font-display text-3xl font-medium"
                  >
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-lime">
                  Resume <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
