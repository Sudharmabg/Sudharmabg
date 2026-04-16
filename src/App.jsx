import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollBadge from './components/ScrollBadge'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <Footer />
          <ScrollBadge />
        </div>
      )}
    </>
  )
}
