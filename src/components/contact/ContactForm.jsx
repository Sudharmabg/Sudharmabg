import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../../data/profile.js'
import { CheckIcon, PlaneIcon } from '../ui/icons.jsx'

// Google Apps Script web app (apps-script/README.md): appends the message to a Google Sheet
// and emails it to Sudharma. Set VITE_CONTACT_ENDPOINT locally (.env.local) and on Vercel.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

const errorText = {
  invalid: 'Please check your name, email and message.',
  rate_limited: 'You just sent a message — give it a minute before sending another.',
  not_configured: "The form isn't connected yet. Please email me directly:",
  server: 'Something went wrong on my side. Please email me directly:',
  network: "Couldn't reach the server. Check your connection, or email me directly:",
}

const EMPTY = { name: '', email: '', message: '', company: '' }
const SUCCESS_DELAY = 1100 // let the paper plane fly off before the success panel takes over

// Contact form whose send button launches a paper plane (thinkingods "Send Hello"), then a
// success panel. Posts as text/plain so the browser skips the CORS preflight Apps Script can't answer.
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | done | error
  const [error, setError] = useState('')
  const [sender, setSender] = useState({ name: '', email: '' })
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const update = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    if (status === 'error') setStatus('idle')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') return

    if (!ENDPOINT) {
      if (import.meta.env.DEV) console.warn('VITE_CONTACT_ENDPOINT is not set — see apps-script/README.md')
      setError(errorText.not_configured)
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...values, page: window.location.href }),
      })
      const data = await res.json().catch(() => ({ ok: false, error: 'server' }))
      if (!data.ok) throw new Error(data.error || 'server')
      setSender({ name: values.name.trim().split(/\s+/)[0], email: values.email.trim() })
      setStatus('sent')
      timer.current = setTimeout(() => {
        setValues(EMPTY)
        setStatus('done')
      }, SUCCESS_DELAY)
    } catch (err) {
      setError(errorText[err.message] || errorText.network)
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setSender({ name: '', email: '' })
  }

  return (
    <div className="relative min-h-full rounded-2xl border border-line bg-surface/40 p-5 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'done' ? (
          <SuccessPanel key="done" sender={sender} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" value={values.name} onChange={update} autoComplete="name" maxLength={100} required />
              <Field
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={update}
                autoComplete="email"
                inputMode="email"
                maxLength={200}
                required
              />
            </div>
            <Field
              className="mt-5"
              label="Message"
              name="message"
              as="textarea"
              rows={5}
              value={values.message}
              onChange={update}
              placeholder="A role, a project, or just hello…"
              minLength={10}
              maxLength={3000}
              required
            />

            {/* Honeypot: hidden from people and assistive tech; bots fill it */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <SendButton status={status} />
              <p aria-live="polite" className="text-sm text-[#ff8a7d]">
                {status === 'error' && (
                  <>
                    {error}{' '}
                    <a href={`mailto:${profile.links.email}`} className="text-ink underline underline-offset-4">
                      {profile.links.email}
                    </a>
                  </>
                )}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuccessPanel({ sender, onReset }) {
  const headingRef = useRef(null)
  // Move focus to the confirmation so keyboard and screen-reader users hear it
  useEffect(() => headingRef.current?.focus(), [])

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-[22rem] flex-col items-start justify-center py-6 lg:min-h-[26rem]"
    >
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.1 }}
        className="grid size-14 place-items-center rounded-full bg-lime text-page shadow-[0_0_40px_-6px_rgb(198_255_61/0.6)]"
      >
        <CheckIcon className="size-6" />
      </motion.span>

      <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em] outline-none">
        Message <span className="font-serif font-normal tracking-normal text-lime italic">sent</span>
      </h3>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        Thanks{sender.name ? `, ${sender.name}` : ''}. Your message has reached me, and I'll reply within 24 hours
        {sender.email ? (
          <>
            {' '}
            at <span className="text-ink">{sender.email}</span>
          </>
        ) : null}
        .
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-lime/60 hover:text-lime"
      >
        Send another message
      </button>
    </motion.div>
  )
}

function Field({ label, name, as = 'input', className = '', ...props }) {
  const Tag = as
  const id = `contact-${name}`
  return (
    <div className={className}>
      <label htmlFor={id} className="kicker mb-2 block">
        {label}
      </label>
      <Tag
        id={id}
        name={name}
        {...props}
        className={`block w-full resize-y rounded-xl border ${as === 'textarea' ? 'lg:min-h-[12rem]' : ''} border-line bg-page px-4 py-3.5 text-base text-ink transition-colors outline-none placeholder:text-muted/60 hover:border-muted/50 focus:border-lime/60 focus-visible:outline-none`}
      />
    </div>
  )
}

function SendButton({ status }) {
  const sent = status === 'sent'
  const sending = status === 'sending'

  return (
    <button
      type="submit"
      disabled={sending || sent}
      className={`group relative inline-flex min-h-12 items-center gap-4 rounded-full border py-1.5 pr-1.5 pl-6 text-sm font-medium transition-colors duration-300 disabled:cursor-wait ${
        sent ? 'border-lime/40 bg-lime/10 text-lime' : 'border-ink bg-ink text-page hover:bg-white'
      }`}
    >
      <span>{sent ? 'Sent' : sending ? 'Sending…' : 'Send message'}</span>
      <span className="relative grid size-10 place-items-center overflow-visible rounded-full">
        <span className={`absolute inset-0 rounded-full transition-colors duration-300 ${sent ? 'bg-lime' : 'bg-page'}`} />
        <AnimatePresence mode="popLayout" initial={false}>
          {sent ? (
            <motion.span
              key="tick"
              className="relative text-page"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.25 }}
            >
              <CheckIcon />
            </motion.span>
          ) : (
            <motion.span
              key="plane"
              className="relative text-lime"
              initial={{ x: -14, y: 14, opacity: 0 }}
              animate={sending ? { x: [0, 2, 0], y: [0, -2, 0], opacity: 1 } : { x: 0, y: 0, opacity: 1 }}
              exit={{ x: 90, y: -70, rotate: 15, opacity: 0, transition: { duration: 0.6, ease: [0.5, 0, 0.75, 0] } }}
              transition={sending ? { repeat: Infinity, duration: 0.6 } : { duration: 0.3 }}
            >
              <PlaneIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}
