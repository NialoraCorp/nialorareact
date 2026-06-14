import './App.css'
import { useFramePreloader } from './lib/frames'
import Loader from './components/Loader'
import Nav from './components/Nav'
import ScrollVideo from './components/ScrollVideo'
import { Manifesto, Showcase, Science, Ritual, Marquee, ComingSoon, Footer } from './sections'

export default function App() {
  const { images, loaded, progress, done } = useFramePreloader()

  return (
    <>
      <Loader progress={progress} done={done} />
      <Nav />
      <main>
        <ScrollVideo images={images} ready={loaded} />
        <Manifesto />
        <Showcase />
        <Marquee />
        <Science />
        <Ritual />
        <ComingSoon />
      </main>
      <Footer />
    </>
  )
}
