import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const CONTACTS = [
  {
    id: 'email',
    label: 'Email',
    value: 'bgsudharma1998@gmail.com',
    href: 'mailto:bgsudharma1998@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/sudharmabg',
    href: 'https://linkedin.com/in/sudharmabg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/sudharmabg',
    href: 'https://github.com/sudharmabg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
      </svg>
    ),
  },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSE2UEy_aleKLlqx5lDSPQTlCykteYO1HtDDgFDJuv59F9_zkm3T4Aps3zJ2XcZJg1/exec';

      // Use URLSearchParams for maximum compatibility with Google Apps Script
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: formDataToSend,
      })

      // Since 'no-cors' doesn't let us read the response, 
      // we assume success if no error was thrown.
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
      
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-muted text-xs tracking-[0.25em] uppercase mb-3">Let's talk</p>
          <h2 className="section-title text-text mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Reach out — I respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <motion.div
            className="flex flex-col gap-4 h-full"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            {CONTACTS.map(c => {
              const [copied, setCopied] = useState(false)
              const handleContactClick = (e) => {
                if (c.id === 'email') {
                  navigator.clipboard.writeText(c.value)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }
              }

              return (
                <a
                  key={c.id}
                  href={c.href}
                  onClick={handleContactClick}
                  target={c.id === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-xl bg-surface border border-stroke glow-effect gradient-border group transition-all duration-300 relative z-10 cursor-pointer"
                  title={c.id === 'email' ? 'Click to send or copy email' : `Visit my ${c.label}`}
                >
                  <div
                    className="p-2.5 rounded-xl transition-all duration-200 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))' }}
                  >
                    <span className="gradient-text">{c.icon}</span>
                  </div>
                  <div>
                    <div className="text-muted text-xs uppercase tracking-wider mb-0.5">{c.label}</div>
                    <div className="text-text text-sm font-medium group-hover:gradient-text transition-all duration-300">
                      {copied ? 'Email Copied!' : c.value}
                    </div>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {copied ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : c.id === 'email' ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-7 0h7m-7-3h7" />
                      ) : (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      )}
                    </svg>
                  </div>
                </a>
              )
            })}

            <a
              href="/Sudharma_Resume.pdf"
              download="Sudharma_Resume.pdf"
              className="flex items-center gap-3 p-4 rounded-xl glow-effect gradient-border justify-center mt-auto relative z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              <svg className="w-4 h-4 gradient-text" fill="none" stroke="url(#grad)" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="gradient-text text-sm font-semibold">Download Resume</span>
            </a>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 bg-surface border border-stroke flex flex-col h-full gap-4"
            >
              <div>
                <label className="block text-muted text-xs uppercase tracking-wider mb-1.5">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-alt border border-stroke rounded-xl px-4 py-3 text-text text-sm placeholder-muted outline-none focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-muted text-xs uppercase tracking-wider mb-1.5">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-alt border border-stroke rounded-xl px-4 py-3 text-text text-sm placeholder-muted outline-none focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-muted text-xs uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  id="contact-message"
                  required
                  placeholder="Tell me about the role or project..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full flex-1 bg-surface-alt border border-stroke rounded-xl px-4 py-3 text-text text-sm placeholder-muted outline-none focus:border-purple-500 transition-colors duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                id="contact-submit"
                disabled={status === 'loading'}
                className="btn-primary w-full justify-center group"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : status === 'success' ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message Sent!
                  </span>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
