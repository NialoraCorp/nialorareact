import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Magnetic } from './Magnetic'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'gold'
  size?: 'sm' | 'md'
  external?: boolean
  icon?: boolean
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const variants = {
  primary: 'bg-plum text-ivory hover:bg-plum-soft',
  ghost: 'border border-plum/25 text-plum hover:border-gold hover:text-gold-deep',
  gold: 'bg-gold text-plum hover:bg-gold-light',
}
const sizes = {
  sm: 'h-10 px-5 text-[10.5px]',
  md: 'h-[52px] px-7 text-[11.5px]',
}

/** Marka butonu: manyetik hover, kayan ok ikonu, yumuşak geçişler. */
export function Button({ children, href, onClick, variant = 'primary', size = 'md', external, icon = true, className, type = 'button', disabled }: Props) {
  const cls = cn(
    'group inline-flex items-center justify-center gap-3 rounded-full font-sans font-medium uppercase tracking-[0.22em] transition-[background-color,color,border-color,box-shadow] duration-500 ease-lux',
    variants[variant],
    sizes[size],
    disabled && 'pointer-events-none opacity-60',
    className,
  )
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="size-[14px] transition-transform duration-500 ease-lux group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          strokeWidth={1.5}
        />
      )}
    </>
  )
  return (
    <Magnetic>
      {href ? (
        <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={cls} disabled={disabled}>
          {inner}
        </button>
      )}
    </Magnetic>
  )
}
