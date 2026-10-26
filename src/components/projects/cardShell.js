// Shared frame for the full-size deck cards: solid (cards stack), two columns on desktop
// (visual | details), visual on top on phones. The details column never scrolls; copy is
// clamped on phones so the whole card fits the deck height.
export const cardShell =
  'grid h-full scroll-mt-24 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_100px_-40px_rgb(0_0_0/0.95)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:grid-rows-1'

export const visualPane = 'flex items-center justify-center border-b border-line bg-page/60 p-4 md:p-6 lg:border-r lg:border-b-0 lg:p-10'

export const detailsPane = 'flex min-h-0 flex-col p-5 md:p-8 lg:p-10'
