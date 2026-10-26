// Dev-only "Demo / Worst case / One / Empty" switch for the project decks (break-ui).
// Plain chrome on purpose: it is not part of the design under test. The choice lives in ?data=
// so a reload keeps it. Rendered only when import.meta.env.DEV.
const STATES = [
  ['demo', 'Demo'],
  ['worst', 'Worst case'],
  ['one', 'One'],
  ['empty', 'Empty'],
]

export const currentDataState = () => new URLSearchParams(window.location.search).get('data') || 'demo'

export default function DataToggle() {
  const active = currentDataState()

  const pick = (id) => {
    const url = new URL(window.location.href)
    if (id === 'demo') url.searchParams.delete('data')
    else url.searchParams.set('data', id)
    url.hash = 'work'
    window.location.assign(url)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: '#d4d4d4',
        font: '12px system-ui, sans-serif',
        boxShadow: '0 4px 16px rgb(0 0 0 / 0.4)',
      }}
    >
      {STATES.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => pick(id)}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            border: 0,
            cursor: 'pointer',
            background: id === active ? '#fff' : 'transparent',
            color: '#111',
            fontWeight: id === active ? 600 : 400,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
