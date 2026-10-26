// About section: bio, expertise accordion (each area backed by proof) and the stack marquee.
// Proof links point at project cards (#project-<slug>) or the Experience section.

// Bio as parts so inline links stay in data; a part with `href` renders as a link.
export const bio = [
  { text: "I'm a full stack & AI engineer in Bengaluru with 6 years of building production systems. " },
  { text: 'I spent five years at Altisource on enterprise Java services and React UI. ' },
  { text: 'Now, at Hatchlab, I lead a team of 10 taking an AI EdTech platform from PoC to v1. ' },
  { text: 'On the side, I build the tools I wish existed, like ' },
  { text: 'Causeline', href: '#project-causeline' },
  { text: '.' },
]

export const expertise = [
  {
    title: 'Backend',
    summary: 'Distributed Java services, data models and the performance work that keeps them fast.',
    tools: ['Java', 'Spring Boot', 'Hibernate', 'REST APIs', 'Microservices', 'Kafka', 'RabbitMQ', 'MySQL', 'PostgreSQL', 'Redis', 'Supabase'],
    proof: [
      { metric: '−35%', label: 'SQL query time', href: '#experience' },
      { metric: '+20%', label: 'throughput', href: '#experience' },
      { label: 'Spring AI Firewall', href: '#project-spring-ai-firewall' },
      { label: 'PayFlow', href: '#project-payflow' },
    ],
  },
  {
    title: 'AI & LLM',
    summary: 'Retrieval pipelines and LLM features that hold up in production, not just in a demo.',
    tools: ['RAG pipelines', 'LLM integration', 'Prompt engineering', 'Recommendation systems', 'Predictive analytics'],
    proof: [
      { metric: '~95%', label: 'RAG accuracy', href: '#experience' },
      { label: 'AI EdTech platform', href: '#experience' },
      { label: 'AmbiSprout', href: '#project-ambisprout' },
    ],
  },
  {
    title: 'Frontend',
    summary: 'React interfaces that load fast and move the numbers that matter.',
    tools: ['React', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Context API'],
    proof: [
      { metric: '< 2s', label: 'dashboards', href: '#experience' },
      { metric: '+7%', label: 'conversion', href: '#experience' },
      { label: 'Causeline UI', href: '#project-causeline' },
      { label: 'TIG World School', href: '#project-tigws' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    summary: 'Containers, pipelines and AWS, so shipping is routine rather than an event.',
    tools: ['AWS EC2', 'S3', 'Lambda', 'RDS', 'Cloudflare', 'Docker', 'GitHub Actions', 'Jenkins', 'Maven'],
    proof: [
      { label: 'TIGWS deployment & SEO', href: '#project-tigws' },
      { label: 'CI/CD pipelines', href: '#experience' },
    ],
  },
]

export const stack = [
  'Java', 'Spring Boot', 'React', 'Next.js', 'Redis', 'Kafka', 'PostgreSQL', 'MySQL',
  'RAG', 'LLMs', 'Supabase', 'Docker', 'AWS', 'Cloudflare', 'GitHub Actions', 'Tailwind CSS', 'Microservices', 'Hibernate',
]
