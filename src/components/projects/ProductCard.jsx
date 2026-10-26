import { Badge, Chip, LinkPill } from '../ui/bits.jsx'
import { BrowserFrame, PhoneFrame } from '../ui/DeviceFrames.jsx'
import { cardShell, detailsPane, visualPane } from './cardShell.js'

// Full-size deck card for a product Sudharma built: screenshot | pitch.
// Story, highlights and stack show on desktop; phones keep the pitch short so the card fits.
export default function ProductCard({ project, index }) {
  const { slug, title, tagline, summary, story, badges, highlights, stack, links, media } = project

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
          {badges.map((b, i) => (
            <Badge key={b} tone={i === 0 ? 'lime' : 'default'}>
              {b}
            </Badge>
          ))}
        </div>

        <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] leading-none font-semibold tracking-[-0.03em] lg:mt-5">{title}</h3>
        <p className="mt-2.5 font-display text-lg font-medium tracking-[-0.01em] text-ink/90 lg:text-xl">
          {tagline[0]} <span className="font-serif font-normal tracking-normal text-lime italic">{tagline[1]}</span>
        </p>

        <p className="mt-3.5 line-clamp-3 text-[15px] leading-relaxed text-muted lg:mt-5 lg:line-clamp-none">{summary}</p>

        {story && (
          <p className="mt-5 hidden border-l-2 border-lime/60 pl-4 text-[15px] leading-relaxed text-ink/85 italic xl:block">{story}</p>
        )}

        <ul className="mt-5 hidden space-y-2 lg:block">
          {highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm text-ink/85">
              <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 bg-lime" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-5 hidden flex-wrap gap-1.5 md:flex">
          {stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

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
