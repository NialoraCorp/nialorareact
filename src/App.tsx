import { useI18n } from '@/lib/i18n'
import { Loader } from '@/components/Loader'
import { Nav } from '@/components/Nav'
import { ScrollStar } from '@/components/ScrollStar'
import { GrainOverlay } from '@/components/GrainOverlay'
import { Stage } from '@/sections/Stage'
import { Lineup } from '@/sections/Lineup'
import { Story } from '@/sections/Story'
import { Niacinamide } from '@/sections/Niacinamide'
import { Film } from '@/sections/Film'
import { Buy } from '@/sections/Buy'
import { Faq } from '@/sections/Faq'
import { Footer } from '@/sections/Footer'

export default function App() {
  const { t } = useI18n()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum focus:px-4 focus:py-2 focus:text-ivory"
      >
        {t.a11y.skip}
      </a>
      <Loader />
      <Nav />
      <main id="main">
        <Stage />
        <Lineup />
        <Story />
        <Niacinamide />
        <Film />
        <Buy />
        <Faq />
      </main>
      <Footer />
      <ScrollStar />
      <GrainOverlay />
    </>
  )
}
