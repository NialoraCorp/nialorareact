import { cn } from '@/lib/utils'
import { useI18n, type Lang } from '@/lib/i18n'

const LANGS: Lang[] = ['tr', 'en']

/** TR / EN seçici — rengi üst öğeden (currentColor) alır. */
export function LangToggle({ className }: { className?: string }) {
  const { t, lang, setLang } = useI18n()
  return (
    <div className={cn('flex items-center text-[10.5px] font-semibold tracking-[0.22em]', className)} role="group" aria-label={t.a11y.lang}>
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-1 opacity-30">/</span>}
          <button
            type="button"
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={cn('px-1 py-1 uppercase transition-opacity duration-300', lang === l ? 'opacity-100' : 'opacity-40 hover:opacity-75')}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}
