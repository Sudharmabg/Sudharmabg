// Projects shown on the homepage. Plan and sourcing rules live in DESIGN.md ("Projects plan").
// Only claim what the live site, README or Sudharma confirmed; no invented metrics.

export const tiers = [
  { id: 'products', label: 'Products I built', note: 'Built end to end, from idea to production' },
  { id: 'client', label: 'Client work', note: 'Shipped for clients through Hatchlab Innovations' },
  { id: 'builds', label: 'Engineering builds', note: 'Backend-heavy systems, open on GitHub' },
]

export const projects = [
  {
    slug: 'causeline',
    tier: 'products',
    title: 'Causeline',
    tagline: ['Trace a click through', 'Spring Boot'],
    summary:
      'An open-source debugging tool that follows one user action from the React click, through Spring controllers, services and transactions, down to every SQL statement on a single timeline. It runs inside your own app, with no account, no agent and nothing sent anywhere.',
    story: 'Five tools open, none of them talking to each other. So I built the one view I kept wishing for.',
    badges: ['Open source', 'Creator'],
    highlights: [
      'React & Next.js → Spring MVC / WebFlux → JDBC / R2DBC',
      'Bottleneck & long-transaction insights',
      'Replay requests, compare runs span by span',
    ],
    stack: ['React', 'Next.js', 'Spring Boot', 'JDBC / R2DBC', 'npm'],
    install: 'npm i @causeline/react',
    links: [
      { label: 'Live site', href: 'https://causeline.dev' },
      { label: 'GitHub', href: 'https://github.com/causeline/causeline' },
      { label: 'npm', href: 'https://www.npmjs.com/package/@causeline/react' },
    ],
    media: {
      desktop: '/projects/causeline/trace.webp',
      url: 'causeline.dev',
      alt: 'Causeline UI showing a 960 ms checkout trace: a bottleneck insight on the payment call and a waterfall from the browser action down to the controller, transaction and services',
    },
  },
  {
    slug: 'ambisprout',
    tier: 'products',
    title: 'AmbiSprout',
    tagline: ["India's AI-powered", 'sustainability companion'],
    summary:
      'A platform that turns green habits into verified, rewarded actions. Sprout, an AI coach, sets personalised daily missions; AI checks photo and receipt proof, tracks real carbon impact and pays out Sprout Coins redeemable with ESG-friendly brands.',
    story: 'Designed, built and shipped end to end — product, UX, frontend, backend and the AI features.',
    badges: ['Product', 'Founder'],
    role: 'Design & UX · Frontend · Backend & APIs · AI features',
    highlights: [
      'AI sustainability coach with daily missions',
      'AI photo verification & receipt analysis',
      'Carbon tracking, streaks, coins & city challenges',
    ],
    stack: ['React', 'REST APIs', 'LLM integration', 'Vision AI'],
    links: [{ label: 'Live site', href: 'https://ambisprout.com' }],
    media: {
      desktop: '/projects/ambisprout/desktop.webp',
      full: '/projects/ambisprout/full.webp',
      phone: '/projects/ambisprout/phone.webp',
      url: 'ambisprout.com',
      alt: "AmbiSprout homepage: India's AI-Powered Sustainability Companion, with mission, streak, impact and coin cards around the Sprout mascot",
    },
  },
  {
    slug: 'tigws',
    tier: 'client',
    title: 'Techno India Group World School',
    shortTitle: 'TIG World School',
    summary:
      'Website for an international residential school by Techno India Group. Admissions-led, photography-first, and built to rank.',
    badges: ['Client · Hatchlab'],
    role: 'UI design · Frontend · Deployment & SEO',
    stack: ['UI design', 'Frontend', 'SEO', 'Deployment'],
    metrics: [
      { value: '27.4K', label: 'Search impressions' },
      { value: '1.06K', label: 'Clicks' },
      { value: '6.6', label: 'Avg. position' },
    ],
    metricsNote: 'Google Search Console · Jul 25 – Oct 25, 2026',
    links: [{ label: 'Live site', href: 'https://www.tigworldschools.com' }],
    media: {
      desktop: '/projects/tigws/desktop.webp',
      full: '/projects/tigws/full.webp',
      phone: '/projects/tigws/phone.webp',
      url: 'tigworldschools.com',
      alt: 'Techno India Group World School homepage with a photo of the campus lobby and an admission enquiry button',
    },
  },
  {
    slug: 'tigmancity',
    tier: 'client',
    title: 'Techno India Manchester City Football School',
    shortTitle: 'TI Man City Football School',
    summary:
      'Website for a Kolkata youth football academy run with City Football Group. Programmes for ages 3–17, coach profiles and tryout bookings.',
    badges: ['Client · Hatchlab'],
    role: 'UI design · Frontend · Deployment',
    stack: ['UI design', 'Frontend', 'Responsive', 'Deployment'],
    links: [{ label: 'Live site', href: 'https://www.tigmancity.com' }],
    media: {
      desktop: '/projects/tigmancity/desktop.webp',
      full: '/projects/tigmancity/full.webp',
      phone: '/projects/tigmancity/phone.webp',
      url: 'tigmancity.com',
      alt: 'Techno India Manchester City Football School homepage: a young player in a Manchester City kit posing with a ball, with a "Book Tryouts" button in the nav',
    },
  },
  {
    slug: 'hatchlab',
    tier: 'client',
    title: 'Hatchlab Innovations',
    summary:
      'Company site for an "Enterprise Creation as a Service" platform — a start-up studio, investment arm and consultancy under one roof.',
    badges: ['UI project · Hatchlab'],
    role: 'UI design · React frontend',
    stack: ['UI design', 'React', 'Responsive'],
    links: [{ label: 'Live site', href: 'https://hatchlabinnovations.com' }],
    media: {
      desktop: '/projects/hatchlab/desktop.webp',
      full: '/projects/hatchlab/full.webp',
      phone: '/projects/hatchlab/phone.webp',
      url: 'hatchlabinnovations.com',
      alt: 'Hatchlab Innovations homepage: "Where Big Ideas Meet Cool Tech & Pro Guidance" over a dark constellation background',
    },
  },
  {
    slug: 'spring-ai-firewall',
    tier: 'builds',
    title: 'Spring AI',
    titleAccent: 'Firewall',
    titleSpaced: true, // "Spring AI Firewall" vs. "TaskHive"
    summary:
      'A Spring Boot starter that puts an AI-assisted firewall in front of your APIs with one dependency. Distributed rate limiting, bot detection and a multi-signal risk score decide whether each request is allowed, logged or blocked — before Spring Security even runs.',
    highlights: [
      'Redis sliding-window rate limiting across instances',
      'Heuristic bot detection + risk scoring engine',
      'Per-path YAML rules, audit logging, optional OpenAI anomaly detection',
    ],
    roadmap: 'Next: prompt-injection & unsafe-output protection for LLM endpoints',
    stack: ['Java', 'Spring Boot', 'Redis', 'OpenAI API'],
    snippet: '<artifactId>spring-ai-firewall-starter</artifactId>',
    links: [{ label: 'GitHub', href: 'https://github.com/Sudharmabg/spring-ai-firewall' }],
    visual: 'firewall',
  },
  {
    slug: 'taskhive',
    tier: 'builds',
    title: 'Task',
    titleAccent: 'Hive',
    summary:
      'An enterprise task platform for teams: epics, tasks and bugs, sprint planning, role-based access and live analytics dashboards.',
    highlights: [
      'JWT auth with Admin / User roles, BCrypt hashing',
      'Sprints, story types, attachments & progress tracking',
      'PostgreSQL schema versioned with Flyway',
    ],
    stack: ['React 18', 'Spring Boot 3', 'Spring Security', 'PostgreSQL', 'Flyway'],
    links: [{ label: 'GitHub', href: 'https://github.com/Sudharmabg/taskhive' }],
    visual: 'taskhive',
  },
  {
    slug: 'payflow',
    tier: 'builds',
    title: 'Pay',
    titleAccent: 'Flow',
    summary:
      'The backend of a UPI-style payments app. Users, UPI ID lookup, wallet transfers, statements and analytics, with transfers that stay correct under concurrency.',
    highlights: [
      'Transactional transfers that lock sender & receiver (ACID)',
      'UPI ID lookup, statements & financial analytics',
      'Layered architecture with DTO validation',
    ],
    stack: ['Java 21', 'Spring Boot 3.3', 'Spring Data JPA', 'H2'],
    links: [{ label: 'GitHub', href: 'https://github.com/Sudharmabg/Payflow' }],
    visual: 'payflow',
  },
]

// All projects in page order (tier by tier), as numbered on the cards and walked by "Next project"
export const projectsInOrder = tiers.flatMap((t) => projects.filter((p) => p.tier === t.id))
