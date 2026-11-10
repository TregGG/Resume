import { SwarmProvider } from './swarm/SwarmProvider';
import { SwarmHud } from './swarm/SwarmHud';
import { About, Archive, Contact, Education, Footer, Hero, Nav, Projects, Skills } from './components/Sections';

export default function App() {
  return (
    <SwarmProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Archive />
        <Education />
        <Contact />
      </main>
      <Footer />
      <SwarmHud />
    </SwarmProvider>
  );
}
