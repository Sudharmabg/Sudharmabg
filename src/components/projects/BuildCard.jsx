import { Link } from 'react-router-dom'
import { Chip, LinkPill, PagePill } from '../ui/bits.jsx'
import FlowDiagram from './FlowDiagram.jsx'
import { cardShell, detailsBody, detailsPane, linkRow, visualPane } from './cardShell.js'

// Full-size deck card for a backend-heavy build: code-drawn flow diagram | details.
export default function BuildCard({ project, index }) {
  const { slug, title, titleAccent, titleSpaced, summary, highlights, roadmap, stack, links, visual } = project

  return (
    <article id={`project-${slug}`} className={cardShell}>
      <div className={visualPane}>
        <Link
          to={`/projects/${slug}`}
          viewTransition
          data-cursor="View"
          aria-label={`${title}${titleSpaced ? ' ' : ''}${titleAccent}: open the project page`}
          className="block w-full max-w-[34rem] rounded-xl"
          style={{ viewTransitionName: `shot-${slug}` }}
        >
          <FlowDiagram type={visual} className="w-full" />
        </Link>
      </div>

      <div className={detailsPane}>
        <div className={detailsBody}>
          <span className="font-mono text-xs text-muted">{String(index).padStart(2, '0')} · Engineering build</span>
          <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] leading-none font-semibold tracking-[-0.03em] lg:mt-5">
            {title}
            {titleSpaced && ' '}
            <span className="font-serif font-normal tracking-normal text-lime italic">{titleAccent}</span>
          </h3>

          <p className="mt-3.5 hidden text-[15px] leading-relaxed text-muted md:line-clamp-3 lg:mt-5 lg:line-clamp-none">{summary}</p>

          <ul className="mt-5 hidden space-y-2 lg:block">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-ink/85">
                <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 bg-lime" />
                {h}
              </li>
            ))}
          </ul>

          {roadmap && <p className="mt-4 hidden font-mono text-[11.5px] leading-relaxed text-lime/80 md:block">→ {roadmap}</p>}

          <div className="mt-5 hidden flex-wrap gap-1.5 md:flex">
            {stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>

        <div className={linkRow}>
          <PagePill to={`/projects/${slug}`}>View project</PagePill>
          {links.map((l) => (
            <LinkPill key={l.href} href={l.href}>
              {l.label}
            </LinkPill>
          ))}
        </div>
      </div>
    </article>
  )
}
