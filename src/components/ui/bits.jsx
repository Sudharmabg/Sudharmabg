import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from './icons.jsx'

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'border-line text-muted',
    lime: 'border-lime/35 bg-lime/[0.07] text-lime',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] uppercase ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Chip({ children }) {
  return <span className="rounded-md border border-line bg-page/60 px-2 py-1 font-mono text-[11px] text-ink/75">{children}</span>
}

export function LinkPill({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-ink transition-[color,border-color,scale] active:scale-[0.97] active:duration-100 hover:border-lime hover:text-lime"
    >
      {children}
      <ArrowUpRight className="size-3.5" />
    </a>
  )
}

// Internal counterpart of LinkPill: lime, arrow pointing on, and a view transition into the page
export function PagePill({ to, children }) {
  return (
    <Link
      to={to}
      viewTransition
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-lime/50 bg-lime/[0.07] px-4 text-sm text-lime transition-[color,border-color,background-color,scale] active:scale-[0.97] active:duration-100 hover:border-lime hover:bg-lime/15"
    >
      {children}
      <ArrowUpRight className="size-3.5 rotate-45" />
    </Link>
  )
}

// Fades content up the first time it scrolls into view.
export function Reveal({ children, delay = 0, className = '', as = 'div', ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      {...rest}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Tag>
  )
}

export function SectionHeader({ index, kicker, title, accent, intro }) {
  return (
    <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="kicker">
          <span className="text-lime">{index}</span> — {kicker}
        </p>
        <h2 className="mt-5 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.03em]">
          {title} <span className="font-serif font-normal tracking-normal text-lime italic">{accent}</span>
        </h2>
      </div>
      {intro && <p className="max-w-sm text-[15px] leading-relaxed text-muted lg:pb-3 lg:text-right">{intro}</p>}
    </Reveal>
  )
}
