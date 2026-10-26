import { navLinks, profile } from '../data/profile.js'
import Logo from './ui/Logo.jsx'
import { ArrowUpRight } from './ui/icons.jsx'

const socials = [
  { label: 'Email', href: `mailto:${profile.links.email}` },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'GitHub', href: profile.links.github },
]

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-10 md:pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {profile.role} {profile.roleAccent}. Backend systems, AI products and the interfaces on top.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-1 sm:grid-cols-[auto_auto]">
            <div>
              <p className="kicker mb-3">Site</p>
              <ul>
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a href={`/${l.href}`} className="inline-flex min-h-10 items-center text-sm text-ink/80 transition-colors hover:text-lime">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="kicker mb-3">Elsewhere</p>
              <ul>
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="group inline-flex min-h-10 items-center gap-1.5 text-sm text-ink/80 transition-colors hover:text-lime"
                    >
                      {s.label}
                      <ArrowUpRight className="size-3 text-muted transition-colors group-hover:text-lime" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted">
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName} · Designed & built in Bengaluru
          </p>
          <a
            href="#top"
            className="group inline-flex min-h-10 items-center gap-2 self-start font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-lime sm:self-auto"
          >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-line transition-colors group-hover:border-lime/50">
              <ArrowUpRight className="size-3.5 -rotate-45" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
