import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/ui/Cursor.jsx'
import Home from './pages/Home.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    // "user" drops transform animations when the OS asks for reduced motion
    <MotionConfig reducedMotion="user">
      <ScrollOnNavigate />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Cursor />
    </MotionConfig>
  )
}

// New page: start at the top, or at the #anchor it links to (e.g. "All work" → the card it came from).
// A layout effect, so it runs inside the view transition's update and the "after" snapshot is right.
// Only for in-app links (PUSH/REPLACE): plain #anchor clicks keep the browser's smooth scroll, and
// Back/Forward (POP) keep the browser's own scroll restoration.
function ScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  useLayoutEffect(() => {
    if (navType === 'POP') return
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, navType])
  return null
}
