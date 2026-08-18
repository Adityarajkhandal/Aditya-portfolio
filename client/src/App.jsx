import './index.css';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <ParticlesBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <section className="section">
          <Education />
        </section>
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
