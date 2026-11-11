import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProject from './components/FeaturedProject'
import ResearchHighlight from './components/ResearchHighlight'
import FieldWork from './components/FieldWork'
import WorkedWith from './components/WorkedWith'
import SelectedWork from './components/SelectedWork'
import About from './components/About'
import Footer from './components/Footer'
import MenuOverlay from './components/MenuOverlay'

// Section order runs night (hero, featured app) → day (research, field work,
// experience, publications) → dusk (contact, footer).
function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Navbar onMenuToggle={() => setMenuOpen(true)} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Hero />
        <FeaturedProject />
        <ResearchHighlight />
        <FieldWork />
        <WorkedWith />
        <SelectedWork />
        <About />
      </main>
      <Footer />
    </>
  )
}

export default App
