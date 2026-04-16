import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPERIENCES = [
  {
    id: 1,
    company: 'Hatchlab Innovations Pvt Ltd',
    role: 'Senior Software Consultant',
    period: 'Jan 2026 – Present',
    type: 'Remote',
    current: true,
    bullets: [
      { text: 'Designed and Developed Modern Websites for Clients' },
      { text: 'Built AI-driven EdTech platform combining emotional and academic intelligence' },
      { text: 'Designed RAG pipelines with', metric: '~95% accuracy', suffix: 'for chatbot' },
      { text: 'Built React dashboards with', metric: '<2s load time' },
      { text: 'Improved API performance by', metric: '30–40%', suffix: 'using Redis' },
      { text: 'Increased user engagement by', metric: '25–35%' },
      { text: 'Designed scalable MySQL schemas' },
    ],
    links: [
      { label: 'TIG World Schools', url: 'https://www.tigworldschools.com/' },
      { label: 'Hatchlab Innovations', url: 'https://hatchlabinnovations.com/' }
    ]
  },
  {
    id: 2,
    company: 'Altisource Business Solutions Pvt Ltd',
    role: 'Software Engineer',
    period: 'Dec 2020 – Nov 2025',
    type: 'Bengaluru',
    current: false,
    bullets: [
      { text: 'Built distributed systems with', metric: '20% throughput increase' },
      { text: 'Improved conversion by', metric: '7%', suffix: 'via React UI optimization' },
      { text: 'Implemented DocuSign workflows + Spring Security' },
      { text: 'Reduced SQL query time by', metric: '35%' },
      { text: 'Accelerated development by', metric: '50%', suffix: 'using AI tools' },
    ],
    links: [
      { label: 'Hubzu', url: 'https://www.hubzu.com/' }
    ]
  },
]

function ExperienceCard({ exp, index, total, inView }) {
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    if (inView) {
      const delay = index === 0 ? 0 : 2500 
      const timer = setTimeout(() => setIsActive(true), delay)
      return () => clearTimeout(timer)
    } else {
      setIsActive(false)
    }
  }, [inView, index])

  return (
    <div className="relative flex gap-6 pb-12 last:pb-0">
      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          animate={{
            scale: isActive ? 1 : 0.5,
            opacity: isActive ? 1 : 0.3,
          }}
          className="w-3 h-3 rounded-full mt-6 shrink-0 relative z-10"
          style={{
            background: exp.current ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)' : 'hsl(0 0% 25%)',
            boxShadow: isActive && exp.current ? '0 0 12px rgba(139,92,246,0.6)' : 'none',
          }}
        >
          {isActive && exp.current && (
            <motion.div
              layoutId="glow"
              className="absolute inset-0 rounded-full bg-purple-500/40 blur-md"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* The Line Segment */}
        <div className="w-px flex-1 mt-2 bg-stroke/30 relative overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            animate={isActive ? { height: '100% ' } : { height: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full"
            style={{
              background: 'linear-gradient(to bottom, #8B5CF6, #3B82F6, transparent)',
            }}
          />
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 rounded-2xl p-6 md:p-8 bg-surface border border-stroke glow-effect gradient-border relative"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-bold text-text">{exp.company}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-muted text-sm">{exp.role}</span>
              {exp.current && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    color: '#A78BFA',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Current
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-muted text-sm">{exp.period}</div>
            <div className="text-muted text-xs mt-0.5 flex items-center gap-1 justify-end">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {exp.type}
            </div>
          </div>
        </div>

        <ul className="space-y-2.5 mb-6">
          {exp.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }} />
              <span>
                {b.text}{' '}
                {b.metric && <span className="gradient-text font-semibold">{b.metric}</span>}{' '}
                {b.suffix}
              </span>
            </li>
          ))}
        </ul>

        {exp.links && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-stroke">
            {exp.links.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                className="pill flex items-center gap-2 group hover:text-white transition-all bg-surface/50 cursor-pointer relative z-10"
              >
                <span className="text-xs font-medium">{link.label}</span>
                <svg className="w-3.5 h-3.5 text-muted group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="experience" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-muted text-xs tracking-[0.25em] uppercase mb-3">Career</p>
          <h2 className="section-title text-text">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted text-sm mt-3">
            5+ years building scalable systems across enterprise and AI platforms.
          </p>
        </motion.div>

        <div className="relative">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard 
              key={exp.id} 
              exp={exp} 
              index={i} 
              total={EXPERIENCES.length} 
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
