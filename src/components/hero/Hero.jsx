import { motion } from 'motion/react'
import { profile } from '../../data/profile.js'
import DotGrid from './DotGrid.jsx'
import FocusReveal from '../ui/FocusReveal.jsx'
import GlowButton from '../ui/GlowButton.jsx'
import { ArrowDown } from '../ui/icons.jsx'

const EASE = [0.16, 1, 0.3, 1]

const rise = (delay) => ({
  initial: { y: '105%' },
  animate: { y: '0%' },
  transition: { duration: 1.1, ease: EASE, delay },
})

const fade = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.3 }}
      >
        <DotGrid className="size-full" />
      </motion.div>
      {/* Keep the name and copy readable over the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_22%_58%,rgb(11_11_11/0.92),transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-page to-transparent" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pt-28 pb-10 md:px-10">
        <motion.div {...fade(0.1)} className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-3 rounded-full border border-lime/30 bg-lime/[0.07] py-2 pr-4 pl-3 text-[13px] font-medium text-ink shadow-[0_0_24px_-8px_rgb(198_255_61/0.35)] backdrop-blur-md">
            <span className="size-2 animate-[pulse-dot_2.2s_ease-out_infinite] rounded-full bg-lime" />
            {profile.availability}
          </span>
        </motion.div>

        {/* w-fit makes the block exactly as wide as the name, so the role can right-align to its last letter */}
        <h1 className="mt-8 w-fit max-w-full font-display leading-[0.84] font-semibold tracking-[-0.035em] uppercase md:mt-10">
          <span className="sr-only">
            {profile.firstName} {profile.lastName} — {profile.role} {profile.roleAccent}
          </span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
            <motion.span {...rise(0.15)} className="hero-name block whitespace-nowrap">
              {profile.firstName} {profile.lastName}
            </motion.span>
          </span>
          <motion.span
            {...fade(0.5)}
            aria-hidden="true"
            className="mt-4 block text-[clamp(1.6rem,4.2vw,3.6rem)] leading-[1.02] font-medium tracking-[-0.02em] normal-case sm:mt-5 sm:text-right"
          >
            {profile.role} <span className="font-serif font-normal tracking-normal text-lime italic">{profile.roleAccent}</span>
          </motion.span>
        </h1>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <motion.div {...fade(0.75)}>
            <FocusReveal
              phrases={profile.focusPhrases}
              className="font-display text-[clamp(1.4rem,2.6vw,2.25rem)] leading-snug font-medium tracking-[-0.01em]"
            />
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">{profile.summary}</p>
          </motion.div>

          <motion.div {...fade(0.9)} className="flex flex-wrap gap-3 lg:justify-end">
            <GlowButton href="#work">View work</GlowButton>
            <GlowButton href="#contact" variant="ghost">
              Get in touch
            </GlowButton>
          </motion.div>
        </div>
      </div>

      <motion.div {...fade(1.05)} className="mx-auto w-full max-w-[1400px] px-5 pb-8 md:px-10">
        <div className="grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
          {profile.heroMeta.map((item) => (
            <div key={item.label}>
              <p className="kicker">{item.label}</p>
              <p className="mt-2 text-sm text-ink">{item.value}</p>
            </div>
          ))}
          <a
            href="#about"
            className="group hidden items-center justify-end gap-3 self-end text-muted transition-colors hover:text-lime md:flex"
          >
            <span className="kicker group-hover:text-lime">Scroll</span>
            <span className="grid size-9 place-items-center rounded-full border border-line transition-colors group-hover:border-lime">
              <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
