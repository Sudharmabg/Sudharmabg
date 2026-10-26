import { ArrowUpRight } from './icons.jsx'

// Pill button whose icon disc wears a lime ring orbiting around it (thinkingods "Glow Ring").
const variants = {
  primary: 'bg-ink text-page border-ink hover:bg-white',
  ghost: 'bg-transparent text-ink border-line hover:border-muted',
}

export default function GlowButton({ href, children, variant = 'primary', icon: Icon = ArrowUpRight, ...rest }) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center gap-4 rounded-full border py-1.5 pr-1.5 pl-6 text-sm font-medium transition-[color,background-color,border-color,scale] duration-300 active:scale-[0.97] active:duration-100 ${variants[variant]}`}
      {...rest}
    >
      {children}
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full">
        <span
          aria-hidden="true"
          className="absolute -inset-1 animate-[ring-spin_3.2s_linear_infinite] bg-[conic-gradient(from_0deg,var(--color-lime),transparent_30%,transparent_60%,var(--color-lime))]"
        />
        <span className="absolute inset-[2px] rounded-full bg-page transition-colors duration-300 group-hover:bg-lime" />
        <Icon className="relative size-4 text-lime transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-page" />
      </span>
    </a>
  )
}
