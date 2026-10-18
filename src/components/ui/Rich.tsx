import { Fragment } from 'react'

/** "*kelime*" parçalarını süslü italik vurguya çevirir (animasyonsuz). */
export function Rich({ text, emClassName = 'em-word' }: { text: string; emClassName?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className={emClassName}>{part.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
