// Code-drawn flow diagrams for backend projects that have no UI to screenshot.
// A lime packet travels down the spine; global reduced-motion CSS parks it.

const flows = {
  firewall: {
    caption: 'request pipeline',
    steps: [
      { label: 'HTTP request', sub: 'IP · headers · API key' },
      { label: 'FirewallFilter', sub: 'highest precedence' },
      { label: 'RuleEngine', sub: 'match path · per-path limits' },
      { label: 'RedisRateLimiter', sub: 'distributed sliding window' },
      { label: 'RiskScoringEngine', sub: 'bot · rate · optional AI' },
    ],
    outcomes: [
      { label: 'Allow', meta: '< 30', tone: 'lime' },
      { label: 'Log', meta: '30–70', tone: 'muted' },
      { label: 'Block 403', meta: '> 70', tone: 'red' },
    ],
  },
  taskhive: {
    caption: 'architecture',
    steps: [
      { label: 'React 18 SPA', sub: 'protected routes · dashboards' },
      { label: 'JWT auth', sub: 'Spring Security · BCrypt' },
      { label: 'Spring Boot 3', sub: 'controllers → services' },
      { label: 'Spring Data JPA', sub: 'repositories · DTOs' },
      { label: 'PostgreSQL', sub: 'Flyway migrations' },
    ],
    outcomes: [
      { label: 'Sprints', tone: 'muted' },
      { label: 'RBAC', tone: 'muted' },
      { label: 'Analytics', tone: 'lime' },
    ],
  },
  payflow: {
    caption: 'POST /transactions',
    steps: [
      { label: 'Validate request', sub: '@Valid DTO · UPI IDs' },
      { label: 'Begin transaction', sub: '@Transactional' },
      { label: 'Lock both wallets', sub: 'sender + receiver rows' },
      { label: 'Debit · credit', sub: 'balance checks' },
      { label: 'Write ledger entry', sub: 'commit' },
    ],
    outcomes: [
      { label: 'Committed', tone: 'lime' },
      { label: 'Rolled back on failure', tone: 'muted' },
    ],
  },
}

const outcomeTones = {
  lime: 'border-lime/40 bg-lime/10 text-lime',
  muted: 'border-line text-ink/70',
  red: 'border-[#ff6b5b]/40 bg-[#ff6b5b]/10 text-[#ff8a7d]',
}

export default function FlowDiagram({ type, className = '' }) {
  const flow = flows[type]
  if (!flow) return null

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-page p-4 md:p-5 ${className}`}
      style={{ backgroundImage: 'radial-gradient(rgb(242 242 242 / 0.06) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      role="img"
      aria-label={`${flow.caption}: ${flow.steps.map((s) => s.label).join(', then ')}`}
    >
      <p className="kicker mb-4">// {flow.caption}</p>

      <ol className="relative space-y-3">
        {/* spine + travelling packet */}
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line">
          <span className="absolute left-1/2 size-2 -translate-x-1/2 animate-[flow-down_2.8s_ease-in-out_infinite] rounded-full bg-lime shadow-[0_0_12px_2px_rgb(198_255_61/0.6)]" />
        </span>
        {flow.steps.map((step) => (
          <li key={step.label} className="relative flex items-baseline gap-4 pl-0">
            <span aria-hidden="true" className="relative top-[3px] size-[15px] shrink-0 rounded-full border border-lime/40 bg-page" />
            <span className="min-w-0">
              <span className="block font-mono text-[12.5px] text-ink">{step.label}</span>
              <span className="hidden truncate font-mono text-[11px] text-muted md:block">{step.sub}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        {flow.outcomes.map((o) => (
          <span key={o.label} className={`rounded-md border px-2.5 py-1 font-mono text-[11px] ${outcomeTones[o.tone]}`}>
            {o.label}
            {o.meta && <span className="ml-1.5 opacity-70">{o.meta}</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
