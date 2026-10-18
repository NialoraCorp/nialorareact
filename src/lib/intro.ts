const KEY = 'nialora-intro'

/** Oturumda intro (loader) henüz gösterilmediyse true. */
export function introPending(): boolean {
  try { return !sessionStorage.getItem(KEY) } catch { return true }
}

export function markIntroDone() {
  try { sessionStorage.setItem(KEY, '1') } catch { /* yoksay */ }
}

/** Intro süresi (sn). Hero ve Nav giriş animasyonları buna göre gecikir. */
export const INTRO_DURATION = 2.3
