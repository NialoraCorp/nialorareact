import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useNavTheme } from '@/lib/useNavTheme'
import { SCROLL_SPRING } from '@/motion/tokens'
import { Star } from './ui/Star'

/** Ekranın altında, scroll ile dönen altın yıldız — sayfanın "ilerleme" imzası. */
export function ScrollStar() {
  const theme = useNavTheme()
  const { scrollYProgress } = useScroll()
  const rotate = useTransform(useSpring(scrollYProgress, SCROLL_SPRING), [0, 1], [0, 720])
  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none fixed bottom-6 left-1/2 z-[65] -translate-x-1/2 transition-colors duration-500', theme === 'dark' ? 'text-gold-light' : 'text-gold-deep')}
      style={{ rotate }}
    >
      <Star className="size-4" />
    </motion.div>
  )
}
