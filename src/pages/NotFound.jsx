import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      {/* React 19 hoists these into <head>; keeps unknown URLs out of search results */}
      <title>Page not found — Sudharma BG</title>
      <meta name="robots" content="noindex" />
      <div>
        <p className="kicker">Error 404</p>
        <h1 className="mt-4 font-display text-6xl font-semibold md:text-8xl">
          Lost the <span className="font-serif font-normal italic text-lime">thread</span>.
        </h1>
        <Link
          to="/"
          className="mt-10 inline-block rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-lime hover:text-lime"
        >
          Back home
        </Link>
      </div>
    </main>
  )
}
