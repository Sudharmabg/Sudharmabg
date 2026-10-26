import Hero from '../components/hero/Hero.jsx'
import About from '../components/about/About.jsx'
import Projects from '../components/projects/Projects.jsx'
import Lab from '../components/lab/Lab.jsx'
import Experience from '../components/experience/Experience.jsx'
import Contact from '../components/contact/Contact.jsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Lab />
      <Experience />
      <Contact />
    </main>
  )
}
