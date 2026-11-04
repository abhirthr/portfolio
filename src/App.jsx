import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProject from './components/FeaturedProject'
import SelectedWork from './components/SelectedWork'
import ResearchHighlight from './components/ResearchHighlight'
import WorkedWith from './components/WorkedWith'
import About from './components/About'
import Footer from './components/Footer'
import MenuOverlay from './components/MenuOverlay'
import { Particles } from './components/ui/particles'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Navbar onMenuToggle={() => setMenuOpen(true)} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Hero />
        <FeaturedProject />
        <div className="light-sections">
          <Particles
            className="light-sections__particles"
            quantity={500}
            staticity={50}
            ease={80}
            size={0.5}
            color="#000000"
          />
          <WorkedWith />
          <ResearchHighlight />
          <SelectedWork />
        </div>
        <About />
      </main>
      <Footer />
    </>
  )
}

export default App
