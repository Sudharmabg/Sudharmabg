import { projects, tiers } from '../../data/projects.js'
import { Reveal, SectionHeader } from '../ui/bits.jsx'
import FlickDeck from '../ui/FlickDeck.jsx'
import ProductCard from './ProductCard.jsx'
import ClientCard from './ClientCard.jsx'
import BuildCard from './BuildCard.jsx'

const byTier = (id) => projects.filter((p) => p.tier === id)
const cardId = (p) => `project-${p.slug}`

// One card fills the content width and the whole card fits on screen
// (viewport minus navbar and deck controls), on desktop and phones.
const DECK_HEIGHT = 'h-[clamp(34rem,calc(100svh-11rem),44rem)]'

export default function Projects() {
  const products = byTier('products')
  const client = byTier('client')
  const builds = byTier('builds')

  const decks = [
    { tier: tiers[0], items: products, offset: 0, Card: ProductCard },
    { tier: tiers[1], items: client, offset: products.length, Card: ClientCard },
    { tier: tiers[2], items: builds, offset: products.length + client.length, Card: BuildCard },
  ]

  return (
    // overflow-x-clip: flicked cards fly off-screen without causing a horizontal scrollbar
    <section id="work" className="scroll-mt-16 overflow-x-clip py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader
          index="02"
          kicker="Selected work"
          title="Things I've"
          accent="built"
          intro="Products I created, sites shipped for clients, and the backend systems behind them."
        />

        {decks.map(({ tier, items, offset, Card }) => (
          <div key={tier.id}>
            <TierHeading tier={tier} />
            <Reveal>
              <FlickDeck
                label={tier.label}
                items={items}
                getId={cardId}
                heightClass={DECK_HEIGHT}
                renderCard={(p, i) => <Card project={p} index={offset + i + 1} />}
              />
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

function TierHeading({ tier }) {
  const i = tiers.indexOf(tier) + 1
  return (
    <Reveal className="mt-14 mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-5 md:mt-20 md:mb-8">
      <h3 className="font-mono text-xs tracking-[0.18em] text-ink uppercase">
        <span className="text-lime">0{i}</span> / {tier.label}
      </h3>
      <p className="text-sm text-muted">{tier.note}</p>
    </Reveal>
  )
}
