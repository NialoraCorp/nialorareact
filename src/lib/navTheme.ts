export type NavTheme = 'light' | 'dark'

type Listener = (t: NavTheme) => void
let current: NavTheme = 'light'
const listeners = new Set<Listener>()

/** Üst bar ve scroll yıldızı, altındaki bölümün zeminine göre renk değiştirir. */
export function setNavTheme(t: NavTheme) {
  if (t === current) return
  current = t
  listeners.forEach((l) => l(t))
}

export function getNavTheme(): NavTheme {
  return current
}

export function subscribeNavTheme(l: Listener): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}
