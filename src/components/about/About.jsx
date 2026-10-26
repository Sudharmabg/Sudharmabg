import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { bio, expertise, stack } from '../../data/about.js'
import { Chip, Reveal, SectionHeader } from '../ui/bits.jsx'
import { ArrowUpRight } from '../ui/icons.jsx'

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="01" kicker="About" title="Hi, I'm" accent="Sudharma" />

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.5] text-ink/85">
              {bio.map((part) =>
                part.href ? (
                  <a
                    key={part.text}
                    href={part.href}
                    className="text-lime underline decoration-lime/40 underline-offset-4 transition-colors hover:decoration-lime"
                  >
                    {part.text}
                  </a>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="kicker mb-3">What I do</p>
            <Accordion items={expertise} />
          </Reveal>
        </div>
      </div>

      <Marquee items={stack} />
    </section>
  )
}

// One row open at a time; the first starts open so the pattern is obvious.
function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  const baseId = useId()

  return (
    <ul className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-panel-${i}`
        return (
          <li key={item.title} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group grid min-h-16 w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 py-4 text-left md:grid-cols-[3rem_minmax(0,1fr)_auto] md:py-5"
              >
                <span className={`font-mono text-xs transition-colors ${isOpen ? 'text-lime' : 'text-muted group-hover:text-ink'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none font-semibold tracking-[-0.025em] transition-colors ${
                    isOpen ? 'text-ink' : 'text-ink/70 group-hover:text-ink'
                  }`}
                >
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`grid size-9 place-items-center rounded-full border text-lg leading-none transition-all duration-300 ${
                    isOpen ? 'rotate-45 border-lime/50 text-lime' : 'border-line text-muted group-hover:border-muted'
                  }`}
                >
                  +
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 md:pl-[3.75rem]">
                    <p className="max-w-xl text-[15px] leading-relaxed text-muted">{item.summary}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tools.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>

                    <p className="kicker mt-5 mb-2.5">Proof</p>
                    <ul className="flex flex-wrap gap-2">
                      {item.proof.map((p) => (
                        <li key={p.label}>
                          <a
                            href={p.href}
                            className="group/proof inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-page/60 px-3.5 text-sm text-ink/85 transition-colors hover:border-lime/50 hover:text-ink"
                          >
                            {p.metric && <span className="font-display font-semibold text-lime">{p.metric}</span>}
                            {p.label}
                            <ArrowUpRight className="size-3 rotate-45 text-muted transition-colors group-hover/proof:text-lime" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

// Slow, endless row of tool names. The list is rendered twice and shifted by half;
// it pauses on hover and stops entirely for reduced motion (global CSS).
function Marquee({ items }) {
  const row = (hidden) =>
    items.map((t) => (
      <li key={`${t}-${hidden}`} aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-6 pr-6">
        <span className="font-display text-[clamp(1.4rem,3vw,2.25rem)] font-medium tracking-[-0.02em] whitespace-nowrap text-ink/25 transition-colors hover:text-ink/80">
          {t}
        </span>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-lime/60" />
      </li>
    ))

  return (
    <div
      className="group mt-16 overflow-hidden border-y border-line py-6 md:mt-24 md:py-8"
      style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}
    >
      <ul aria-label="Tech stack" className="flex w-max animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  )
}
