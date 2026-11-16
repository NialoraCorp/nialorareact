import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { DEALER } from '@/content/product'
import { useSectionTheme } from '@/lib/useNavTheme'
import { EASE } from '@/motion/tokens'
import { SplitText } from '@/components/ui/SplitText'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full border-b border-plum/35 bg-transparent py-3 text-[16px] font-medium text-plum placeholder:font-normal placeholder:text-plum/45 transition-colors duration-300 focus:border-gold focus:outline-none'
const label = 'block text-[12px] font-bold uppercase tracking-[0.24em] text-plum/85'

/**
 * Eczane bayilik başvurusu. Düğme bir modal açar (arka plan kararır); gönderim Formsubmit
 * AJAX ucu üzerinden DEALER.email'e e-posta olarak gider. Adres sayfada gösterilmez.
 */
export function Dealer() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  useSectionTheme(ref, 'light')
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const d = t.dealer

  const close = () => {
    setOpen(false)
    if (status !== 'sending') setStatus((s) => (s === 'sent' ? 'idle' : s))
    window.setTimeout(() => triggerRef.current?.querySelector('button')?.focus({ preventScroll: true }), 50)
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    if (data.get('_honey')) return // bot tuzağı
    setStatus('sending')
    const v = (k: string) => String(data.get(k) ?? '').trim()
    const payload: Record<string, string> = {
      [d.fields.pharmacy]: v('pharmacy'),
      [d.fields.pharmacist]: v('pharmacist'),
      [d.fields.email]: v('email'),
      [d.fields.phone]: v('phone'),
      [d.fields.city]: v('city') || '-',
      [d.fields.message]: v('message') || '-',
      _subject: `${d.subject} — ${v('pharmacy')}`,
      _replyto: v('email'),
      _template: 'table',
      _captcha: 'false',
    }
    try {
      // 20 sn içinde cevap gelmezse bekletme (Formsubmit zaman zaman yavaşlıyor / kesiliyor)
      const signal = 'timeout' in AbortSignal ? AbortSignal.timeout(20_000) : undefined
      const res = await fetch(DEALER.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal,
      })
      if (!res.ok) throw new Error(String(res.status))
      // Formsubmit hata durumunda da 200 döner: {"success":"false","message":"This form needs Activation..."}
      const json: { success?: string | boolean; message?: string } = await res.json().catch(() => ({}))
      if (String(json.success) !== 'true') {
        console.warn('[dealer] Formsubmit:', json.message ?? json)
        throw new Error('formsubmit')
      }
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="bayilik" ref={ref} className="bg-pearl px-[clamp(20px,5vw,72px)] py-[clamp(96px,14vh,180px)]">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1fr_0.9fr] md:items-end md:gap-20">
        <div>
          <Reveal as="p" variant="fade" className="eyebrow">{d.eyebrow}</Reveal>
          <SplitText as="h2" text={d.line} className="statement mt-5 max-w-[12ch] text-plum" />
        </div>
        <div>
          <Reveal as="p" delay={0.15} className="max-w-[36ch] font-display text-[clamp(20px,2vw,28px)] italic leading-[1.35] text-plum/75">
            {d.lead}
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <div ref={triggerRef}>
              <Button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="dealer-dialog">
                {d.open}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      <DealerModal open={open} onClose={close} status={status} onSubmit={onSubmit} />
    </section>
  )
}

function DealerModal({
  open,
  onClose,
  status,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  status: Status
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  const { t } = useI18n()
  const d = t.dealer
  const firstField = useRef<HTMLInputElement>(null)

  // Esc ile kapat, açıkken sayfa kaydırmasını kilitle, ilk alana odaklan
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const id = window.setTimeout(() => firstField.current?.focus({ preventScroll: true }), 450)
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      window.clearTimeout(id)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="dealer-overlay"
          className="fixed inset-0 z-[85] grid place-items-center overflow-y-auto bg-plum/70 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
          data-lenis-prevent
        >
          <motion.div
            id="dealer-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dealer-title"
            className="relative my-auto w-full max-w-[780px] rounded-[1.5rem] bg-ivory p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] sm:p-10 md:p-12"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t.a11y.close}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-plum/20 text-plum transition-colors hover:bg-plum hover:text-ivory sm:right-6 sm:top-6"
            >
              <X className="size-[18px]" strokeWidth={1.5} />
            </button>

            <p className="eyebrow">{d.eyebrow}</p>
            <h3 id="dealer-title" className="statement-sm mt-3 pr-12 text-plum">
              {status === 'sent' ? d.sent.title : d.open}
            </h3>

            {status === 'sent' ? (
              <div className="mt-6" role="status">
                <p className="max-w-[44ch] text-[16px] font-medium leading-[1.7] text-plum/80">{d.sent.text}</p>
                <div className="mt-8">
                  <Button onClick={onClose} icon={false}>{t.a11y.close}</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 grid gap-7 sm:grid-cols-2">
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                <div>
                  <label htmlFor="dealer-pharmacy" className={label}>{d.fields.pharmacy}</label>
                  <input ref={firstField} id="dealer-pharmacy" name="pharmacy" required autoComplete="organization" placeholder={d.placeholders.pharmacy} className={field} />
                </div>
                <div>
                  <label htmlFor="dealer-pharmacist" className={label}>{d.fields.pharmacist}</label>
                  <input id="dealer-pharmacist" name="pharmacist" required autoComplete="name" placeholder={d.placeholders.pharmacist} className={field} />
                </div>
                <div>
                  <label htmlFor="dealer-email" className={label}>{d.fields.email}</label>
                  <input id="dealer-email" name="email" type="email" required autoComplete="email" placeholder={d.placeholders.email} className={field} />
                </div>
                <div>
                  <label htmlFor="dealer-phone" className={label}>{d.fields.phone}</label>
                  <input id="dealer-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" minLength={10} placeholder={d.placeholders.phone} className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="dealer-city" className={label}>
                    {d.fields.city} <span className="font-medium normal-case tracking-normal text-plum/55">· {d.optional}</span>
                  </label>
                  <input id="dealer-city" name="city" autoComplete="address-level2" placeholder={d.placeholders.city} className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="dealer-message" className={label}>
                    {d.fields.message} <span className="font-medium normal-case tracking-normal text-plum/55">· {d.optional}</span>
                  </label>
                  <textarea id="dealer-message" name="message" rows={3} placeholder={d.placeholders.message} className={`${field} resize-y`} />
                </div>

                <label className="flex items-start gap-3 text-[14px] font-medium leading-[1.6] text-plum/85 sm:col-span-2">
                  <input type="checkbox" required className="mt-1 size-[18px] shrink-0 accent-[#8f6d22]" />
                  <span>{d.consent}</span>
                </label>

                <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                  <Button type="submit" disabled={status === 'sending'} icon={status !== 'sending'}>
                    {status === 'sending' ? d.sending : d.submit}
                  </Button>
                  {status === 'error' && (
                    <p className="text-[14px] font-medium leading-[1.6] text-rose-deep" role="alert">
                      <span className="font-semibold">{d.error.title}</span> {d.error.text}
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
