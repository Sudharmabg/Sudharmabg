import { profile } from '../../data/profile.js'

// Italic-serif "S" framed by the same lime corner brackets as the hero's focus frame.
// On hover/focus the brackets close in around the letter.
const corners = [
  'top-0 left-0 border-t-[1.5px] border-l-[1.5px] group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:translate-y-[3px]',
  'top-0 right-0 border-t-[1.5px] border-r-[1.5px] group-hover:-translate-x-[3px] group-hover:translate-y-[3px] group-focus-visible:-translate-x-[3px] group-focus-visible:translate-y-[3px]',
  'bottom-0 left-0 border-b-[1.5px] border-l-[1.5px] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px]',
  'right-0 bottom-0 border-r-[1.5px] border-b-[1.5px] group-hover:-translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:-translate-x-[3px] group-focus-visible:-translate-y-[3px]',
]

export default function Logo({ href = '/#top' }) {
  return (
    <a
      href={href}
      aria-label={`${profile.firstName} ${profile.lastName} — home`}
      className="group -m-1 flex min-h-11 items-center gap-3 rounded-md p-1 focus-visible:outline-offset-2"
    >
      <span aria-hidden="true" className="relative grid size-9 place-items-center">
        {corners.map((c) => (
          <span
            key={c}
            className={`absolute size-2.5 border-lime transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${c}`}
          />
        ))}
        <span className="translate-y-[1px] font-serif text-[26px] leading-none text-ink italic">
          {profile.firstName[0]}
        </span>
      </span>
      <span aria-hidden="true" className="hidden text-sm font-medium tracking-[-0.01em] min-[400px]:inline">
        {profile.firstName} {profile.lastName}
      </span>
    </a>
  )
}
