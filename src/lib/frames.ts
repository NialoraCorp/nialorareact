import { useEffect, useRef, useState } from 'react'

/** Scroll-scrub kare dizisi (public/frames/f_001.jpg … f_121.jpg). */
export const FRAME_COUNT = 121

export const framePath = (i: number) =>
  `/frames/f_${String(i + 1).padStart(3, '0')}.jpg`

export interface FrameLoad {
  images: React.MutableRefObject<HTMLImageElement[]>
  loaded: number
  progress: number // 0..1
  done: boolean
}

/**
 * Tüm kareleri belleğe önyükler. İlerleme yüzdesi loader için,
 * çözülmüş HTMLImageElement dizisi ScrollVideo'nun canvas çizimi için.
 */
export function useFramePreloader(): FrameLoad {
  const images = useRef<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let count = 0
    const arr: HTMLImageElement[] = new Array(FRAME_COUNT)

    const bump = () => {
      if (cancelled) return
      count += 1
      setLoaded(count)
      if (count >= FRAME_COUNT) setDone(true)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = bump
      img.onerror = bump // bozuk kare olsa bile yükleyici takılmasın
      img.src = framePath(i)
      arr[i] = img
    }
    images.current = arr

    return () => { cancelled = true }
  }, [])

  return { images, loaded, progress: loaded / FRAME_COUNT, done }
}
