import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    // "user" drops transform animations when the OS asks for reduced motion
    <MotionConfig reducedMotion="user">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </MotionConfig>
  )
}
