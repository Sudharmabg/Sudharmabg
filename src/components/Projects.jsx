import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PROJECTS = [
  {
    id: 1,
    title: 'Spring AI Firewall',
    description:
      'AI-powered security layer for LLM applications that detects and prevents prompt injection and unsafe outputs.',
    impact: 'Reusable middleware for securing AI + RAG systems.',
    tech: ['Spring Boot', 'LLM APIs', 'Prompt Engineering', 'REST APIs'],
    github: 'https://github.com/Sudharmabg/spring-ai-firewall',
    live: null,
    badge: 'Featured',
    color: '#8B5CF6',
  },
  {
    id: 2,
    title: 'MediTrack',
    description:
      'Healthcare system for managing patient records and workflows. Structured backend system with scalable architecture.',
    impact: 'Structured backend system with scalable architecture.',
    tech: ['Spring Boot', 'MySQL', 'React'],
    github: 'https://github.com/Sudharmabg/MediTrack',
    live: null,
    color: '#3B82F6',
  },
  {
    id: 3,
    title: 'TaskHive',
    description:
      'Task management platform for teams. Modular system for task tracking and execution.',
    impact: 'Modular system for task tracking and execution.',
    tech: ['React', 'Spring Boot', 'REST APIs'],
    github: 'https://github.com/Sudharmabg/taskhive',
    live: null,
    color: '#06B6D4',
  },
  {
    id: 4,
    title: 'Smart Parking System',
    description:
      'System design for real-time parking optimization. Scalable urban parking solution design.',
    impact: 'Scalable urban parking solution design.',
    tech: ['System Design', 'Backend Architecture', 'DB Modeling'],
    github: 'https://github.com/Sudharmabg/Smart_Parking_Design',
    live: null,
    color: '#10B981',
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

function ProjectCard({ project, index, inView }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      onClick={() => window.open(project.github, '_blank')}
      className="relative rounded-2xl p-6 md:p-8 bg-surface border border-stroke glow-effect gradient-border flex flex-col gap-5 group cursor-pointer"
      whileHover={{ scale: 1.015 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: project.color, boxShadow: `0 0 8px ${project.color}80` }}
            />
            {project.badge && (
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#A78BFA',
                }}
              >
                {project.badge}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-text group-hover:gradient-text transition-all duration-300">
            {project.title}
          </h3>
        </div>
        <div
          className="p-2.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke={project.color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0011.414 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed flex-1">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map(t => (
          <span key={t} className="pill hover:text-white glow-effect gradient-border cursor-default">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-stroke text-muted text-xs group-hover:text-purple-400 transition-colors">
        <span>Click to view on GitHub</span>
        <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-muted text-xs tracking-[0.25em] uppercase mb-3">Work</p>
          <h2 className="section-title text-text">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted text-sm mt-3 max-w-xl">
            A selection of production systems, platforms, and proof-of-concept builds.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
