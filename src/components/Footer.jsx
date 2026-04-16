import { useState } from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  const [emailCopied, setEmailCopied] = useState(false)

  const handleEmailClick = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('bgsudharma1998@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  return (
    <footer className="relative py-10 px-6 border-t border-stroke">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="gradient-text font-bold text-sm">SBG</span>
          <span className="w-px h-4 bg-stroke" />
          <span className="text-muted text-sm">Sudharma BG</span>
        </div>
        <p className="text-muted text-xs">
          © {year} Sudharma BG. Built with React &amp; Vite.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleEmailClick}
            className="text-muted text-xs hover:text-text transition-colors cursor-pointer"
            title="Click to copy email"
          >
            {emailCopied ? '📋 Copied!' : 'Email'}
          </button>
          <a
            href="https://linkedin.com/in/sudharmabg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-xs hover:text-text transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/sudharmabg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-xs hover:text-text transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
