# Portfolio v2 — Design Spec

Source content: https://sudharmabg.vercel.app/ (v1). Direction **C — editorial hybrid**:
codeandchill-style editorial layout + a few signature components from thinkingods + Netflix "Seasons" only in Experience.

## Visual system

| Token | Value | Use |
|---|---|---|
| `bg` | `#0B0B0B` | page |
| `surface` | `#151515` | cards, accordion rows |
| `border` | `#262626` | hairlines |
| `text` | `#F2F2F2` | primary |
| `muted` | `#8A8A8A` | secondary copy, labels |
| `accent` | `#C6FF3D` | electric lime — **sparingly**: active states, key numbers, cursor-reactive dots, focus rings |

Typography
- Display / headings: **Clash Display** (heavy) — fallback General Sans
- Accent words: **Instrument Serif Italic** — e.g. "Spring AI *Firewall*", "Full Stack & AI *Engineer*"
- Body: **Inter**
- Mono: **JetBrains Mono** — labels, tags, counters (`01 / 04`), section kickers

Logo
- **Bracket monogram:** an italic-serif "S" inside four lime corner brackets (the same motif as the hero's focus frame), followed by "Sudharma BG" in Inter.
- **Hover/focus:** the brackets snap 3px inward with a springy ease.
- **Phones (< 400px):** the mark is shown alone.
- **Favicon:** `public/favicon.svg` matches the mark.

## Stack
- Vite + React, `.jsx` only
- React Router — `/`, `/projects/:slug`, 404
- Tailwind CSS v4 — tokens above in the `@theme` block
- Motion (Framer Motion) — reveals, hovers, accordion, page transitions
- GSAP + ScrollTrigger — scroll-driven only (marquee speed, pinned sections)
- Canvas effects (dot grid, globe) hand-written, no 3D library
- Content in `src/data/*.js`, never hard-coded in components
- Deploy: Vercel

## Homepage sections
**Page order (decided 2026-10-26):** Hero → 01 About → 02 Work → 03 Lab → 04 Experience → 05 Contact → Footer. (Lab added 2026-10-26.)

**Navbar:** About · Work · Lab · Experience · Contact, in page order.

**Merged About:** Impact strip, Intro and Expertise are merged into one **About** section — a short bio, a 4-row expertise accordion where each row links to its proof, and a slim stack marquee. There is no separate impact strip, because Experience already carries the numbers. Items 2–4 below are superseded by this; they're kept for reference.

**About (built):**
- Heading "Hi, I'm *Sudharma*", with the bio on the left (sticky on desktop).
- "What I do" accordion with one row open at a time: summary, tool chips, and proof pills that link to `#project-<slug>` or `#experience`. A link to a rail card also expands it.
- Marquee of the stack that pauses on hover and stops for reduced motion.
- Data in `src/data/about.js`.

1. **Hero** — huge name "SUDHARMA / BG" (display type, sized so SUDHARMA fills the column). Role "Full Stack & AI *Engineer*" (no "Senior" — seniority shows via badge, years and Experience) sits on the BG row, **right-aligned to the last letter of SUDHARMA**; on phones it drops below the name, left-aligned. Background: **Mesh Flow** dot grid that bends toward the cursor (lime highlights near pointer). Tagline with **Focus Reveal**. "Available for senior roles & consulting" badge. CTAs: View work / Résumé (**Glow Ring** button).
2. **Impact strip** — count-up numbers: 5+ yrs · 30–40% faster APIs · ~95% RAG accuracy · 25–35% engagement.
3. **Intro** — giant "Intro" heading + about card; tech stack as **infinite marquee rows** (one row per category, alternating direction).
4. **Expertise** — numbered accordion: 01 Backend · 02 AI & LLM · 03 Frontend · 04 Cloud & DevOps. Each opens to tools + proof points tied to metrics.
5. **Projects:** three tiers (01 Products · 02 Client work · 03 Engineering builds), see "Projects plan" below.
   - **Layout (2026-10-26):** each tier is a **flick-card deck** (`ui/FlickDeck.jsx`, after thinkingods' "Flick Cards Slider"). The cards are fanned into a 3D stack.
   - **Interaction:**
     - Drag the front card: it follows the pointer and tilts.
     - Release past 22% of its width, or flick faster than 650 px/s, and it arcs away to the back of the deck; otherwise it springs home.
     - Arrows, dots, ←/→ keys and `#project-<slug>` links (which bring that card to the front) work too.
   - **Card size:** one card at a time, full content width. Height `clamp(34rem, 100svh − 11rem, 44rem)`, so the whole card fits on screen on desktop and phones.
   - **Cards:** `ProductCard`, `ClientCard`, `BuildCard` share `cardShell.js`: visual | details on desktop, visual on top on phones. Phone copy is clamped so the card fits; if copy still runs long it fades out at the bottom, and the link row is always visible. Long client names use `shortTitle` below `lg`. A one-card deck has no drag or controls; an empty tier is left out.
   - **Full-page scroll (2026-10-26):** screenshots with `media.full` glide through the whole homepage on mouse hover; on touch they play once when the front card is mostly in view. `npm run capture` stitches `full.webp` screen by screen and cuts `desktop.webp` from its top so the swap is seamless.
   - **Project pages:** `/projects/:slug` (`pages/ProjectPage.jsx`), prerendered per project and listed in the sitemap. Card screenshot / "View project" opens it with a view transition: the frame morphs into the page hero (`view-transition-name: shot-<slug>` / `phone-<slug>`). "All work" returns to `/#project-<slug>`.
   - **Context cursor:** mouse-only label beside the system cursor for elements with `data-cursor` ("Drag" on the front card, "View" on screenshots, "Next" on the next-project link).
   - **Stress test (dev only):** `/?data=worst|one|empty` swaps in `src/data/projects.worst.js`, with a switch at the bottom of the screen.
   - This replaces the earlier rows, the expanding rail and the scroll carousel; the tier plans below still describe the content.
6. **Experience — "Seasons"** (built): Season 2 · Hatchlab Innovations (Jan 2026–), Season 1 · Altisource (Dec 2020–Nov 2025).
   - **Header:** a "Now streaming" / "Completed" badge, dates with a duration computed live, and a watch-progress bar.
   - **Episodes:** achievements listed as `E01…` with metrics in a lime right-hand column. Numbers are exactly as on v1.
   - **Chips:** clients/products with one line of context each.
   - Data in `src/data/experience.js`. The company blurbs are new copy, so confirm them with the user.
7. **Contact** (built):
   - "Let's *talk*".
   - **Left column:** email with a copy button, a Résumé row, and a compact location card. LinkedIn and GitHub live only in the footer, to avoid repeating them. The card has a dotted globe swaying around a lime Bengaluru marker, plus live IST time.
   - **Right column:** the form. The send button's plane flies off on success and a tick appears.
   - **Backend:** `apps-script/` (Sheets + Gmail), configured via `VITE_CONTACT_ENDPOINT`. Without it, the form falls back to mailto.
   - **Footer** (built): logo + one-liner, Site / Elsewhere links, copyright, back to top.

## Projects plan (decided 2026-10-26)

### Tier ① Products I built (two full-width flagship rows)

**Causeline** — https://causeline.dev
- **What it is:** an open-source debugging tool that traces a React click through Spring Boot to the SQL, on one timeline (React/Next.js · Spring MVC/WebFlux · JDBC/R2DBC). Install with `npm i @causeline/react`.
- **Badges:** `Open source` · `Creator`
- **Story:** "Five tools open, none of them talking to each other."
- **Visual:** screenshot of the trace waterfall from causeline.dev in a browser frame. Can be swapped for a looping clip later without changing the layout.
- **Metrics:** npm downloads / GitHub stars. The values are still to come from the user, so leave them out until provided.
- **Links:** Live, GitHub, npm.

**AmbiSprout** — https://ambisprout.com
- **What it is:** India's AI-powered sustainability companion. Sprout AI coach, AI photo and receipt verification, carbon footprint tracking, Sprout Coins rewards, city challenges.
- **Badges:** `Product` · `Founder`
- **Role:** design/UX, React frontend, backend/APIs, AI features (end to end).
- **Visual:** desktop screenshot + overlapping phone screenshot.
- **Links:** Live, GitHub (Ambisprout repo).

### Tier ② Client work

**Techno India Group World School** — https://www.tigworldschools.com
- **Badges:** `Client · Hatchlab`. The client may be named publicly (confirmed by the user).
- **Role:** designed the site, built the frontend, deployment & SEO.
- **Visual:** desktop + phone screenshots.
- **Metrics** (Google Search Console, Jul 25 – Oct 25, 2026; always shown with that window): 27.4K search impressions · 1.06K clicks · 3.9% CTR · average position 6.6.
- **Links:** Live.

**Techno India Manchester City Football School** — https://www.tigmancity.com
- **What it is:** site for a Kolkata youth football academy with City Football Group (programmes, coaches, tryout booking).
- **Badges:** `Client · Hatchlab`.
- **Role:** UI design, frontend, deployment (confirmed by the user). No metrics until the user provides them.
- **Visual:** desktop + phone screenshots.
- **Links:** Live.

**Hatchlab Innovations** — https://hatchlabinnovations.com
- **What it is:** the company site for an "Enterprise Creation as a Service" platform (Inception, Ventures, ONE).
- **Badges:** `UI project · Hatchlab`.
- **Role:** UI design + React frontend. The user described it as a UI project; confirm the exact role before launch.
- **Visual:** dark hero with the constellation background and yellow accent words; desktop + phone screenshots.
- **Links:** Live.

**Layout:** TIGWS and Hatchlab sit side by side as two equal cards on desktop and stack on phones.

### Tier ③ Engineering builds (Expanded Cards rail → swipe row on phones)
Visuals for this tier are code-drawn diagrams in the site style, not screenshots.

**Spring AI Firewall**
- **What it is:** a Spring Boot starter that adds an AI-assisted API firewall from a single dependency. Redis sliding-window distributed rate limiting, heuristic bot detection, a multi-signal risk-scoring engine (<30 allow · 30–70 log · >70 block), per-path YAML rules, audit logging, optional OpenAI anomaly detection. Runs before Spring Security.
- **Roadmap line:** prompt-injection and unsafe-output protection for LLM endpoints. Present it as next on the roadmap, never as built.
- **Not on Maven Central:** do not claim it is published.
- **Visual:** an animated request flowing Filter → Rules → Redis → Risk score → Allow / Log / Block, plus the dependency snippet.
- **Links:** GitHub.

**TaskHive**
- **What it is:** an enterprise task platform. React 18 + Spring Boot 3, JWT + role-based access, sprints, epics/tasks/bugs, analytics dashboards, PostgreSQL + Flyway.
- **No live demo** (the README only points at localhost).
- **Visual:** architecture strip React → JWT → Spring Boot → PostgreSQL, plus feature chips.
- **Links:** GitHub.

**PayFlow** (replaces MediTrack)
- **What it is:** a UPI-style payments backend. Java 21, Spring Boot 3.3, JPA; transactional wallet transfers with row locking (ACID), UPI ID lookup, statements, financial analytics.
- **Visual:** a transfer flow — request → validate → lock sender & receiver → debit/credit → ledger entry.
- **Links:** GitHub.

### Order and assets
- **Phone/swipe order:** Causeline → AmbiSprout → TIGWS → Hatchlab → Spring AI Firewall → TaskHive → PayFlow.
- **Screenshots:** captured from the live sites at 1440×900 and 390×844, saved as WebP in `public/projects/<slug>/`.
  - Re-capture with `npm run capture [slug]` (`scripts/capture-projects.mjs`, which uses the installed Chrome).
  - Causeline uses its own published product image (`causeline.dev/img/trace-slow.webp`).

## Case-study page (`/projects/:slug`)
Problem → Architecture (diagram) → My role → Key decisions → Results (metrics) → Stack → Links. Written gradually; page renders whatever fields exist.

## Contact pipeline
Form → `fetch` POST to a **Google Apps Script web app** → appends a row to a Google Sheet + sends a Gmail notification (`MailApp.sendEmail`).
- Send as `Content-Type: text/plain` (JSON string body) to avoid a CORS preflight.
- Honeypot field + basic length validation; script rejects empty/oversized payloads.
- Script URL in `VITE_CONTACT_ENDPOINT` (`.env`), script source kept in `apps-script/Code.gs`.

## Mobile-first (required)
The site must be fully mobile friendly — phone is a first-class target, not a fallback.
- **Build mobile-first:** base Tailwind classes target phones; `sm:` / `md:` / `lg:` add the desktop layout.
- **Test widths:** 360, 375, 414 (phones), 768 (tablet), 1024, 1440. Zero horizontal scroll at every width.
- **Layout:** single column on phones; 16–20px side gutters; sections stack in reading order; no fixed heights that clip content. Use `svh`/`dvh`, never raw `100vh`.
- **Type:** fluid sizes (`clamp()` / width-based); hero name always fits the column; body text ≥ 15px; line length ≤ ~70ch.
- **Touch:** tap targets ≥ 44×44px; nothing important is hover-only — every hover reveal has a tap/visible equivalent (e.g. project links always visible on touch).
- **Component swaps on touch / small screens:**
  - Dot grid: ambient drift only (no pointer), lower density.
  - Expanded Cards rail → horizontal swipe row with scroll-snap.
  - Accordion → full-width tap rows.
  - Particle Globe → static image or lighter canvas.
  - Marquee → slower, still readable.
- **Navigation:** compact header + full-screen-width menu with large tap rows; closes on link tap and Escape.
- **Safe areas:** respect `env(safe-area-inset-*)` for notched phones; `theme-color` matches the page.
- **Performance on phones:** LCP < 2.5s on mid-range 4G; images responsive (`srcset`, lazy below the fold); canvas effects pause off-screen and cap DPR at 2.
- **Forms:** correct input types (`email`), 16px+ font to avoid iOS zoom, keyboard doesn't cover the submit button.

## SEO (built)
**Site URL:** `https://sudharmabg.vercel.app`. It is hard-coded in `index.html` (canonical, OG, JSON-LD), `public/robots.txt`, `public/sitemap.xml` and the og image text — change all of them together.

**Head tags:**
- Title (≤60 chars) and description (≤160).
- Canonical URL.
- Open Graph `profile` + Twitter `summary_large_image`, using `public/og.png`.

**Structured data:**
- JSON-LD: a `ProfilePage` whose main entity is a `Person` (job, employer, alumni, `knowsAbout`, `sameAs` LinkedIn/GitHub).

**Prerender:**
- `npm run build` server-renders `/` (`src/entry-server.jsx` + `scripts/prerender.mjs`), so crawlers and link previews get the full HTML without JavaScript. No browser is needed, so it works on Vercel.
- Code that runs during render must not touch `window` (guard it with `typeof window`).

**Images:**
- `npm run og` regenerates `og.png` (1200×630) and `apple-touch-icon.png`.

**Other:**
- `robots.txt` + `sitemap.xml`.
- The 404 page sets `noindex` via React 19 `<title>`/`<meta>`.
- When case-study pages exist: add them to the sitemap and the prerender list.

## Guardrails
- `prefers-reduced-motion`: disable canvas animation, marquee, and count-ups; keep simple fades.
- Performance budget: LCP < 2s desktop / < 2.5s mobile, canvas effects pause when off-screen.
- Accessibility: visible lime focus rings, accordion and form fully keyboard-operable, contrast AA.
