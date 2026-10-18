import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind class birleştirici (shadcn / 21st.dev bileşen sözleşmesi). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
