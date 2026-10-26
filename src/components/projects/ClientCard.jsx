import { Badge, LinkPill } from '../ui/bits.jsx'
import { BrowserFrame, PhoneFrame } from '../ui/DeviceFrames.jsx'
import { cardShell, detailsPane, visualPane } from './cardShell.js'

// Full-size deck card for client work: desktop + phone screenshots | role, results, link.
export default function ClientCard({ project, index }) {
  const { slug, title, summary, badges, role, metrics, metricsNote, links, media } = project

  return (
    <article id={`project-${slug}`} className={cardShell}>
      <div className={visualPane}>
        <div className={`relative w-full max-w-[44rem] ${media.phone ? 'pr-5 pb-5 md:pr-8 md:pb-8' : ''}`}>
          <BrowserFrame src={media.desktop} alt={media.alt} url={media.url} />
          {media.phone && <PhoneFrame src={media.phone} className="absolute right-0 bottom-0 w-[21%] min-w-[64px]" />}
        </div>
      </div>

      <div className={detailsPane}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-xs text-muted">{String(index).padStart(2, '0')}</span>
          {badges.map((b) => (
            <Badge key={b} tone="lime">
              {b}
            </Badge>
          ))}
        </div>

        <h3 className="mt-3 font-display text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.02] font-semibold tracking-[-0.025em] lg:mt-5">{title}</h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-muted lg:mt-4 lg:line-clamp-none">{summary}</p>

        <p className="mt-3 text-sm lg:mt-4">
          <span className="kicker mr-2">Role</span>
          <span className="text-ink/85">{role}</span>
        </p>

        {metrics && (
          <div className="mt-4 border-t border-line pt-4 lg:mt-6 lg:pt-5">
            <dl className="grid grid-cols-3 gap-3">
              {metrics.map((m) => (
                // dt must come first in the DOM; flex-col-reverse shows the value on top
                <div key={m.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 text-xs leading-snug text-muted">{m.label}</dt>
                  <dd className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-none font-semibold tracking-[-0.02em] text-lime">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 hidden font-mono text-[10.5px] tracking-wide text-muted/80 md:block">{metricsNote}</p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
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
