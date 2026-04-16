import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SKILLS = [
  {
    category: 'Backend',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
      </svg>
    ),
    items: ['Java', 'Spring Boot', 'Spring Framework', 'Hibernate', 'REST APIs', 'Microservices', 'Kafka', 'RabbitMQ', 'MySQL', 'PostgreSQL', 'Redis', 'SQL Tuning'],
    featured: true,
  },
  {
    category: 'Frontend',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: ['React.js', 'Tailwind CSS', 'Redux Toolkit', 'Context API', 'HTML5', 'CSS3'],
  },
  {
    category: 'AI & ML',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    items: ['Prompt Engineering', 'RAG Pipelines', 'LLM Integration', 'Data Analysis', 'Recommendation Systems', 'Predictive Analytics'],
  },
  {
    category: 'Cloud & DevOps',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    items: ['AWS (EC2, S3, Lambda, RDS)', 'Docker', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Maven', 'Git', 'Postman', 'Jira'],
  },
]

const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    x: i % 2 === 0 ? -50 : 50,
    y: 20
  }),
  show: (i) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.8,
      delay: (i * 0.1) + 1,
      ease: [0.22, 1, 0.36, 1]
    },
  }),
}

function SkillCard({ skill, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="relative rounded-2xl p-6 bg-surface border border-stroke glow-effect gradient-border cursor-default"
    >
      {skill.featured && (
        <span className="absolute top-4 right-4 text-xs font-medium gradient-text">★ Core Focus</span>
      )}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="p-2 rounded-lg"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))' }}
        >
          <span className="gradient-text">{skill.icon}</span>
        </div>
        <h3 className="font-semibold text-sm tracking-wide text-text">{skill.category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skill.items.map(item => (
          <span key={item} className="pill hover:text-white glow-effect gradient-border cursor-default">
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-muted text-xs tracking-[0.25em] uppercase mb-3">Expertise</p>
          <h2 className="section-title text-text">
            Technical <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {SKILLS.map((skill, i) => (
            <SkillCard key={skill.category} skill={skill} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
