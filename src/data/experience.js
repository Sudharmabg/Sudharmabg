// Career shown as "Seasons" (DESIGN.md: the one place the Netflix metaphor is used).
// Claims mirror v1 (sudharmabg.vercel.app) — keep numbers exactly as stated there.
// Newest season first. `end: null` means current.

export const seasons = [
  {
    season: 2,
    company: 'Hatchlab Innovations',
    legalName: 'Hatchlab Innovations Pvt Ltd',
    role: 'Senior Software Consultant',
    start: '2026-01',
    end: null,
    location: 'Remote',
    blurb:
      'Started an AI-based EdTech platform from scratch and have carried it from PoC to MVP to version 1 — while building, leading and mentoring the team of 10 behind it.',
    // Flagship product of this season, shown as a PoC → MVP → v1 journey
    journey: {
      title: 'EdTech Platform',
      note: 'Emotional + Academic intelligence',
      stages: ['PoC', 'MVP', 'v1'],
      current: 2,
    },
    team: { size: 10, note: 'Built and lead the team, and mentor every member' },
    episodes: [
      { title: 'Started the AI EdTech platform and took it from PoC to MVP to v1', metric: 'v1', metricLabel: 'now' },
      { title: 'Built and lead a team of 10, mentoring each member', metric: '10', metricLabel: 'people' },
      { title: 'RAG pipelines for an AI chatbot', metric: '~95%', metricLabel: 'accuracy' },
      { title: 'API performance improved with Redis caching', metric: '30–40%', metricLabel: 'faster' },
      { title: 'React dashboards that load fast', metric: '< 2s', metricLabel: 'load time' },
      { title: 'User engagement increased', metric: '+25–35%', metricLabel: 'engagement' },
      { title: 'Scalable MySQL schemas designed' },
    ],
  },
  {
    season: 1,
    company: 'Altisource',
    legalName: 'Altisource Business Solutions Pvt Ltd',
    role: 'Software Engineer',
    start: '2020-12',
    end: '2025-11',
    location: 'Bengaluru',
    blurb: 'Five years on enterprise real-estate and mortgage platforms: distributed Java services, secure workflows and conversion-focused React UI.',
    clients: [{ name: 'Hubzu', note: 'online real-estate auction marketplace', href: 'https://www.hubzu.com/' }],
    episodes: [
      { title: 'Distributed systems throughput increased', metric: '+20%', metricLabel: 'throughput' },
      { title: 'SQL query time reduced', metric: '−35%', metricLabel: 'query time' },
      { title: 'Conversion improved through React UI optimisation', metric: '+7%', metricLabel: 'conversion' },
      { title: 'Development accelerated with AI tools', metric: '50%', metricLabel: 'faster delivery' },
      { title: 'DocuSign workflows with Spring Security' },
    ],
  },
]
