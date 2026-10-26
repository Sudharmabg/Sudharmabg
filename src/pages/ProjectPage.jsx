import { Link, useParams } from 'react-router-dom'
import { projectsInOrder, tiers } from '../data/projects.js'
import { Badge, Chip, LinkPill, Reveal } from '../components/ui/bits.jsx'
import { BrowserFrame, PhoneFrame } from '../components/ui/DeviceFrames.jsx'
import FlowDiagram from '../components/projects/FlowDiagram.jsx'
import { ArrowUpRight } from '../components/ui/icons.jsx'
import NotFound from './NotFound.jsx'

// /projects/:slug — one project in full. The hero frame carries the same view-transition name as
// the frame on its homepage card, so clicking a card grows its screenshot into this page.
export default function ProjectPage() {
  const { slug } = useParams()
  const i = projectsInOrder.findIndex((p) => p.slug === slug)
  if (i === -1) return <NotFound />

  const project = projectsInOrder[i]
  const next = projectsInOrder[(i + 1) % projectsInOrder.length]
  const tier = tiers.find((t) => t.id === project.tier)
  const { title, titleAccent, titleSpaced, tagline, summary, story, badges = [], role, highlights, roadmap, stack, metrics, metricsNote, links, media, visual } =
    project
  const name = titleAccent ? `${title}${titleSpaced ? ' ' : ''}${titleAccent}` : title

  return (
    <main className="pt-28 pb-20 md:pt-36 md:pb-28">
      <title>{`${name} — Sudharma BG`}</title>
      <meta name="description" content={summary} />

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Link
          to={`/#project-${slug}`}
          viewTransition
          className="kicker inline-flex min-h-10 items-center gap-2 transition-colors hover:text-lime"
        >
          <ArrowUpRight className="size-3.5 -rotate-135" />
          All work
        </Link>

        <header className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
          <div>
            <p className="kicker">
              <span className="text-lime">{String(i + 1).padStart(2, '0')}</span> — {tier.label}
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.03em]">
              {title}
              {titleAccent && (
                <>
                  {titleSpaced && ' '}
                  <span className="font-serif font-normal tracking-normal text-lime italic">{titleAccent}</span>
                </>
              )}
            </h1>
            {tagline && (
              <p className="mt-4 font-display text-xl font-medium tracking-[-0.01em] text-ink/90 md:text-2xl">
                {tagline[0]} <span className="font-serif font-normal tracking-normal text-lime italic">{tagline[1]}</span>
              </p>
            )}
          </div>
          <div>
            {badges.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {badges.map((b, n) => (
                  <Badge key={b} tone={n === 0 ? 'lime' : 'default'}>
                    {b}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-[17px] leading-relaxed text-muted">{summary}</p>
          </div>
        </header>

        {/* Hero visual: the screenshot (or diagram) the card showed, now full width */}
        <div className="mt-12 md:mt-16">
          {media ? (
            <div className={`relative mx-auto max-w-[72rem] ${media.phone ? 'pr-6 pb-6 md:pr-12 md:pb-12' : ''}`}>
              <BrowserFrame src={media.desktop} alt={media.alt} url={media.url} vtName={`shot-${slug}`} priority />
              {media.phone && (
                <PhoneFrame src={media.phone} vtName={`phone-${slug}`} className="absolute right-0 bottom-0 w-[18%] min-w-[72px]" />
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-[44rem]" style={{ viewTransitionName: `shot-${slug}` }}>
              <FlowDiagram type={visual} className="w-full" />
            </div>
          )}
        </div>

        {/* Facts */}
        <Reveal as="dl" className="mt-14 grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {role && <Fact label="Role">{role}</Fact>}
          {stack && (
            <Fact label="Stack">
              <span className="flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </span>
            </Fact>
          )}
          {links.length > 0 && (
            <Fact label="Links">
              <span className="flex flex-wrap gap-2">
                {links.map((l) => (
                  <LinkPill key={l.href} href={l.href}>
                    {l.label}
                  </LinkPill>
                ))}
              </span>
            </Fact>
          )}
          {metrics && (
            <Fact label="Results">
              <span className="grid grid-cols-3 gap-3">
                {metrics.map((m) => (
                  <span key={m.label}>
                    <span className="block font-display text-2xl leading-none font-semibold text-lime">{m.value}</span>
                    <span className="mt-1.5 block text-xs leading-snug text-muted">{m.label}</span>
                  </span>
                ))}
              </span>
              <span className="mt-3 block font-mono text-[10.5px] tracking-wide text-muted/80">{metricsNote}</span>
            </Fact>
          )}
        </Reveal>

        {(story || highlights || roadmap) && (
          <Reveal className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            {story ? (
              <blockquote className="border-l-2 border-lime/60 pl-5 font-display text-2xl leading-snug font-medium tracking-[-0.01em] text-ink/90 md:text-3xl">
                {story}
              </blockquote>
            ) : (
              <p className="kicker">What it does</p>
            )}
            <div>
              {highlights && (
                <ul className="space-y-3">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] text-ink/85">
                      <span aria-hidden="true" className="mt-[8px] size-1.5 shrink-0 bg-lime" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {roadmap && <p className="mt-6 font-mono text-[12px] leading-relaxed text-lime/80">→ {roadmap}</p>}
            </div>
          </Reveal>
        )}

        {/* The whole site, top to bottom, at reading size */}
        {media?.full && (
          <section className="mt-20 md:mt-28">
            <Reveal className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-5">
              <h2 className="font-mono text-xs tracking-[0.18em] text-ink uppercase">
                <span className="text-lime">↓</span> The whole page
              </h2>
              <p className="text-sm text-muted">Homepage, top to bottom, as shipped</p>
            </Reveal>
            <BrowserFrame src={media.full} alt={`${name}: the full homepage`} url={media.url} aspect="" className="mx-auto max-w-[60rem]" />
          </section>
        )}

        {/* Next project */}
        <Link
          to={`/projects/${next.slug}`}
          viewTransition
          data-cursor="Next"
          className="group mt-24 block border-t border-line pt-6 md:mt-32"
        >
          <span className="kicker">Next project</span>
          <span className="mt-3 flex items-center justify-between gap-6 font-display text-[clamp(2rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.03em] transition-colors group-hover:text-lime">
            {next.titleAccent ? `${next.title}${next.titleSpaced ? ' ' : ''}${next.titleAccent}` : (next.shortTitle ?? next.title)}
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line transition-[border-color,translate] group-hover:translate-x-1 group-hover:border-lime md:size-16">
              <ArrowUpRight className="size-5 rotate-45" />
            </span>
          </span>
        </Link>
      </div>
    </main>
  )
}

function Fact({ label, children }) {
  return (
    <div>
      <dt className="kicker mb-3">{label}</dt>
      <dd className="text-[15px] leading-relaxed text-ink/85">{children}</dd>
    </div>
  )
}
