import { useEffect, useState } from 'react'
import { profile } from '../../data/profile.js'
import { Reveal, SectionHeader } from '../ui/bits.jsx'
import { ArrowUpRight } from '../ui/icons.jsx'
import ContactForm from './ContactForm.jsx'
import Globe from './Globe.jsx'

// LinkedIn / GitHub live in the footer right below, so Contact only adds the resume.
const channels = [{ label: 'Resume', value: 'Download PDF', href: profile.resumeUrl, download: 'Sudharma_BG_Resume.pdf' }]

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader
          index="05"
          kicker="Contact"
          title="Let's"
          accent="talk"
          intro="Open to senior roles and consulting. I reply within 24 hours."
        />

        {/* Phones: email & links → form → globe. Desktop: form spans the right column. */}
        <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6">
          <Reveal className="lg:col-start-1 lg:row-start-1">
            <EmailBlock />
            <ul className="mt-6 border-t border-line">
              {channels.map((c) => (
                <li key={c.label} className="border-b border-line">
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    download={c.download || undefined}
                    className="group flex min-h-14 items-center justify-between gap-4 py-3"
                  >
                    <span>
                      <span className="kicker block">{c.label}</span>
                      <span className="mt-1 block text-[15px] text-ink/85 transition-colors group-hover:text-ink">{c.value}</span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-lime/50 group-hover:text-lime">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.15} className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <LocationCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function EmailBlock() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.links.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked; the address is still a mailto link.
    }
  }

  return (
    <div>
      <p className="kicker">Email</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <a
          href={`mailto:${profile.links.email}`}
          className="font-display text-[clamp(1.35rem,2.6vw,2.1rem)] leading-tight font-medium tracking-[-0.02em] break-all text-ink decoration-lime/60 underline-offset-[6px] transition-colors hover:text-lime hover:underline"
        >
          {profile.links.email}
        </a>
        <button
          type="button"
          onClick={copy}
          className="min-h-9 rounded-full border border-line px-3 font-mono text-[11px] tracking-wider text-muted uppercase transition-colors hover:border-muted hover:text-ink"
        >
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  )
}

function useIstTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 20_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function LocationCard() {
  const time = useIstTime()
  return (
    <div className="flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface/40 p-3 pr-5 md:gap-6">
      <Globe className="block aspect-square w-[42%] max-w-[200px] shrink-0" />
      <dl className="min-w-0 space-y-4">
        <div>
          <dt className="kicker">Based in</dt>
          <dd className="mt-1 text-[15px] text-ink">{profile.location}</dd>
        </div>
        <div>
          <dt className="kicker">Local time</dt>
          <dd className="mt-1 font-mono text-[15px] text-ink">
            {time} <span className="text-muted">IST · UTC+5:30</span>
          </dd>
        </div>
        <div>
          <dt className="kicker">Works</dt>
          <dd className="mt-1 text-[15px] text-ink">Remote, across time zones</dd>
        </div>
      </dl>
    </div>
  )
}
