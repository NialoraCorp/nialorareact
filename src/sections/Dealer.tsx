import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { DEALER } from '@/content/product'
import { useSectionTheme } from '@/lib/useNavTheme'
import { EASE } from '@/motion/tokens'
import { SplitText } from '@/components/ui/SplitText'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full border-b border-plum/25 bg-transparent py-3 text-[15px] text-plum placeholder:text-plum/35 transition-colors duration-300 focus:border-gold focus:outline-none'
const label = 'block text-[10.5px] font-semibold uppercase tracking-[0.28em] text-plum/55'

/**
 * Eczane bayilik başvurusu. Düğmeye basılınca form açılır; gönderim Formsubmit AJAX ucu
 * üzerinden DEALER.email'e e-posta olarak gider. Adres sayfada gösterilmez.
 */
export function Dealer() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const firstField = useRef<HTMLInputElement>(null)
  useSectionTheme(ref, 'light')
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const d = t.dealer

  useEffect(() => {
    if (open) window.setTimeout(() => firstField.current?.focus({ preventScroll: true }), 650)
  }, [open])

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
      const res = await fetch(DEALER.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="bayilik" ref={ref} className="bg-pearl px-[clamp(20px,5vw,72px)] py-[clamp(96px,14vh,180px)]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-end md:gap-20">
          <div>
            <Reveal as="p" variant="fade" className="eyebrow">{d.eyebrow}</Reveal>
            <SplitText as="h2" text={d.line} className="statement mt-5 max-w-[12ch] text-plum" />
          </div>
          <div>
            <Reveal as="p" delay={0.15} className="max-w-[36ch] font-display text-[clamp(20px,2vw,28px)] italic leading-[1.35] text-plum/75">
              {d.lead}
            </Reveal>
            <AnimatePresence initial={false}>
              {!open && status !== 'sent' && (
                <motion.div
                  key="open"
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <Button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="dealer-form">
                    {d.open}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-14 border-t border-gold/40 pt-8"
              role="status"
            >
              <p className="statement-sm text-plum">{d.sent.title}</p>
              <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.7] text-mauve">{d.sent.text}</p>
            </motion.div>
          ) : open ? (
            <motion.div
              key="form"
              id="dealer-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="overflow-hidden"
            >
              <form onSubmit={onSubmit} className="mt-14 grid gap-8 border-t border-gold/40 pt-10 sm:grid-cols-2">
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
                    {d.fields.city} <span className="normal-case tracking-normal text-plum/40">· {d.optional}</span>
                  </label>
                  <input id="dealer-city" name="city" autoComplete="address-level2" placeholder={d.placeholders.city} className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="dealer-message" className={label}>
                    {d.fields.message} <span className="normal-case tracking-normal text-plum/40">· {d.optional}</span>
                  </label>
                  <textarea id="dealer-message" name="message" rows={3} placeholder={d.placeholders.message} className={`${field} resize-y`} />
                </div>

                <label className="flex items-start gap-3 text-[13px] leading-[1.6] text-mauve sm:col-span-2">
                  <input type="checkbox" required className="mt-1 size-4 shrink-0 accent-[#8f6d22]" />
                  <span>{d.consent}</span>
                </label>

                <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                  <Button type="submit" disabled={status === 'sending'} icon={status !== 'sending'}>
                    {status === 'sending' ? d.sending : d.submit}
                  </Button>
                  {status === 'error' && (
                    <p className="text-[13px] leading-[1.6] text-rose-deep" role="alert">
                      <span className="font-semibold">{d.error.title}</span> {d.error.text}
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
