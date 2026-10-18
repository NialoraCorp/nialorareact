import { cn } from '@/lib/utils'

/** Dört uçlu altın yıldız (marka süsü). Emoji yerine SVG. */
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-3 fill-current', className)} aria-hidden>
      <path d="M12 0c.4 6.8 4.8 11.2 12 12-7.2.8-11.6 5.2-12 12-.4-6.8-4.8-11.2-12-12 7.2-.8 11.6-5.2 12-12Z" />
    </svg>
  )
}
