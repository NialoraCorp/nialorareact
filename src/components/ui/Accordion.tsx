import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/motion/tokens'

export interface AccordionItem {
  q: string
  a: ReactNode
}

interface Props {
  items: AccordionItem[]
  defaultOpen?: number | null
  className?: string
}

/** Tek seferde bir öğe açık; yükseklik auto'ya animasyonlu. */
export function Accordion({ items, defaultOpen = 0, className }: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const base = useId()
  return (
    <div className={cn('divide-y divide-gold/25 border-y border-gold/25', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        const panel = `${base}-p-${i}`
        return (
          <div key={i}>
            <button
              type="button"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
              aria-controls={panel}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display text-[clamp(22px,2.4vw,30px)] leading-tight text-plum">{item.q}</span>
              <motion.span
                className="grid size-9 shrink-0 place-items-center rounded-full border border-gold/50 text-gold-deep transition-colors group-hover:bg-gold/10"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Plus className="size-4" strokeWidth={1.5} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panel}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="max-w-[62ch] pb-7 text-[15px] leading-[1.8] text-mauve">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
