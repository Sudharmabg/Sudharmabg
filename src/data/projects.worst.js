// Dev-only fixtures for stress-testing the project decks (break-ui). Never imported in production:
// Projects.jsx reads them only behind import.meta.env.DEV and a ?data= URL param.
// Values are realistic for this portfolio: long client names, a missing phone shot, extra metrics.
import { projects as demo } from './projects.js'

const bySlug = (s) => demo.find((p) => p.slug === s)

export const worst = [
  {
    ...bySlug('ambisprout'),
    slug: 'worst-product',
    title: 'AmbiSprout for Enterprises',
    tagline: ["India's AI-powered sustainability companion", 'for teams, campuses and cities'],
    badges: ['Product', 'Founder', 'Open source', 'Hackathon winner'],
    highlights: [
      'AI sustainability coach that sets personalised daily missions for every employee',
      'AI photo verification, receipt analysis and fraud detection for submitted proof',
      'Carbon tracking, streaks, coins, leaderboards & inter-company city challenges',
      'SSO with Google Workspace and Microsoft Entra ID',
      'Admin analytics with ESG report export (BRSR, GRI)',
    ],
    stack: ['React', 'Next.js', 'Spring Boot', 'PostgreSQL', 'Redis', 'LLM integration', 'Vision AI', 'AWS', 'Docker', 'Kubernetes'],
    links: [
      { label: 'Live site', href: 'https://ambisprout.com' },
      { label: 'Case study', href: 'https://ambisprout.com/#case' },
      { label: 'GitHub', href: 'https://github.com/Sudharmabg' },
      { label: 'Play Store', href: 'https://play.google.com/' },
    ],
    media: { ...bySlug('ambisprout').media, phone: undefined, url: 'enterprise.ambisprout.com/dashboard/overview' },
  },
  { ...bySlug('causeline'), slug: 'worst-product-2', story: undefined },

  {
    ...bySlug('tigmancity'),
    slug: 'worst-client',
    role: 'UI design · Frontend · Backend & APIs · Deployment & SEO',
    metrics: [
      { value: '128.4K', label: 'Search impressions' },
      { value: '12.06K', label: 'Clicks' },
      { value: '9.4%', label: 'Click-through rate' },
      { value: '3.2', label: 'Avg. position in Google' },
    ],
    metricsNote: 'Google Search Console · Jul 25 – Oct 25, 2026',
  },
  {
    ...bySlug('tigws'),
    slug: 'worst-client-2',
    title: 'Sri Bhagawan Mahaveer Jain College of Engineering & Technology',
    badges: [],
    media: { ...bySlug('tigws').media, phone: undefined },
    metrics: undefined,
  },
  bySlug('hatchlab'),

  {
    ...bySlug('spring-ai-firewall'),
    slug: 'worst-build',
    title: 'Distributed',
    titleAccent: 'Rate-Limiter-as-a-Service',
    roadmap: undefined,
    highlights: [
      ...bySlug('spring-ai-firewall').highlights,
      'Token-bucket and sliding-window-log algorithms behind one interface',
    ],
    stack: ['Java 21', 'Spring Boot 3.3', 'Redis Cluster', 'Lua scripts', 'Testcontainers', 'Gatling', 'Grafana', 'Prometheus'],
    links: [],
  },
  { ...bySlug('taskhive'), slug: 'worst-build-2', visual: 'not-drawn-yet' },
]

// One card per tier: counters read "01 / 01" and flicking sends the only card "to the back"
export const one = ['causeline', 'tigmancity', 'payflow'].map(bySlug)

// A tier with no cards yet (e.g. client work removed before a new site is ready)
export const empty = demo.filter((p) => p.tier !== 'client')
