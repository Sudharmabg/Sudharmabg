import { seasons } from '../../data/experience.js'
import { Reveal, SectionHeader } from '../ui/bits.jsx'
import { ArrowUpRight } from '../ui/icons.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const parse = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return { y, m }
}

const formatMonth = (ym) => {
  const { y, m } = parse(ym)
  return `${MONTHS[m - 1]} ${y}`
}

// Inclusive month count, so Dec 2020 – Nov 2025 reads as 5 yrs. Current roles count to today.
function duration(start, end) {
  const s = parse(start)
  const now = new Date()
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 }
  const months = (e.y - s.y) * 12 + (e.m - s.m) + 1
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 0) return `${months} mo${months === 1 ? '' : 's'}`
  if (rest === 0) return `${years} yr${years === 1 ? '' : 's'}`
  return `${years} yr${years === 1 ? '' : 's'} ${rest} mo${rest === 1 ? '' : 's'}`
}

// A product's path through stages (PoC → MVP → v1); stages up to `current` are lit.
function Journey({ title, note, stages, current }) {
  return (
    <div className="mt-6 rounded-xl border border-lime/25 bg-lime/[0.04] p-4">
      <p className="kicker">Flagship product</p>
      <p className="mt-2 font-display text-xl font-semibold tracking-[-0.01em]">{title}</p>
      <p className="font-mono text-[11px] text-muted">{note}</p>

      <ol className="mt-4 grid grid-cols-3" aria-label={`Stages: ${stages.join(', ')}; currently ${stages[current]}`}>
        {stages.map((stage, i) => {
          const reached = i <= current
          return (
            <li key={stage} className="relative">
              {/* connector to the next stage */}
              {i < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-[5px] right-0 left-3 h-px ${i < current ? 'bg-lime/70' : 'bg-line'}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`relative block size-[11px] rounded-full border ${
                  i === current
                    ? 'animate-[pulse-dot_2.2s_ease-out_infinite] border-lime bg-lime'
                    : reached
                      ? 'border-lime bg-lime/60'
                      : 'border-line bg-page'
                }`}
              />
              <span className={`mt-2 block font-mono text-[12px] ${reached ? 'text-ink' : 'text-muted'}`}>
                {stage}
                {i === current && <span className="ml-1.5 text-lime">· now</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function ClientChip({ name, note, href }) {
  const body = (
    <>
      <span className="flex items-center gap-1.5 text-sm text-ink">
        {name}
        {href && <ArrowUpRight className="size-3 text-muted transition-colors group-hover:text-lime" />}
      </span>
      <span className="block font-mono text-[11px] text-muted">{note}</span>
    </>
  )
  const cls = 'group block rounded-lg border border-line bg-page/60 px-3 py-2'
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={`${cls} min-h-11 transition-colors hover:border-lime/50`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader
          index="04"
          kicker="Experience"
          title="Career, in"
          accent="seasons"
          intro="6 years shipping enterprise platforms and AI products. Newest season first."
        />
        <div className="mt-12 space-y-5 md:mt-16 md:space-y-6">
          {seasons.map((s) => (
            <Season key={s.company} data={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Season({ data }) {
  const { season, company, legalName, role, start, end, location, blurb, journey, team, clients, episodes } = data
  const current = end === null

  return (
    <Reveal
      as="article"
      className="rounded-2xl border border-line bg-surface/30 p-5 md:p-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:p-10"
    >
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs tracking-[0.18em] text-ink uppercase">
            Season <span className="text-lime">{String(season).padStart(2, '0')}</span>
          </span>
          {current ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/35 bg-lime/[0.07] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] text-lime uppercase">
              <span className="size-1.5 animate-[pulse-dot_2.2s_ease-out_infinite] rounded-full bg-lime" />
              Now streaming
            </span>
          ) : (
            <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">
              Completed
            </span>
          )}
        </div>

        <h3 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-none font-semibold tracking-[-0.03em]" title={legalName}>
          {company}
        </h3>
        <p className="mt-3 text-lg text-ink/90">{role}</p>
        <p className="mt-2 font-mono text-[12px] text-muted">
          {formatMonth(start)} – {current ? 'Present' : formatMonth(end)}
          <span className="mx-2 text-line">/</span>
          {duration(start, end)}
          <span className="mx-2 text-line">/</span>
          {location}
        </p>

        {/* Watch-progress bar: finished seasons are full, the current one is still playing */}
        <div aria-hidden="true" className="mt-5 h-[3px] overflow-hidden rounded-full bg-line">
          <div className={`relative h-full rounded-full ${current ? 'w-3/5 bg-lime' : 'w-full bg-lime/45'}`}>
            {current && (
              <span className="absolute top-1/2 right-0 size-2 translate-x-1/2 -translate-y-1/2 animate-[pulse-dot_2.2s_ease-out_infinite] rounded-full bg-lime" />
            )}
          </div>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-muted">{blurb}</p>

        {journey && <Journey {...journey} />}

        {team && (
          <div className="mt-3 flex items-center gap-4 rounded-xl border border-line bg-page/60 px-4 py-3.5">
            <span className="font-display text-4xl leading-none font-semibold tracking-[-0.03em] text-lime">{team.size}</span>
            <span>
              <span className="kicker block">Team</span>
              <span className="mt-1 block text-sm text-ink/85">{team.note}</span>
            </span>
          </div>
        )}

        {clients && (
          <div className="mt-5">
            <p className="kicker">{clients.length > 1 ? 'Clients & products' : 'Product'}</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {clients.map((c) => (
                <li key={c.name}>
                  <ClientChip {...c} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <div className="mt-8 lg:mt-0">
        <p className="kicker mb-3">{episodes.length} episodes</p>
        <ol className="border-t border-line">
          {episodes.map((ep, i) => (
            <li
              key={ep.title}
              className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-line py-3.5 transition-colors md:grid-cols-[3rem_minmax(0,1fr)_auto] md:py-4 md:hover:bg-surface/50"
            >
              <span className="font-mono text-[11px] text-muted transition-colors group-hover:text-lime">
                E{String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[14.5px] leading-snug text-ink/90 md:text-[15px]">{ep.title}</span>
              {ep.metric ? (
                <span className="text-right">
                  <span className="block font-display text-lg leading-none font-semibold tracking-[-0.01em] whitespace-nowrap text-lime md:text-xl">
                    {ep.metric}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] whitespace-nowrap text-muted">{ep.metricLabel}</span>
                </span>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
