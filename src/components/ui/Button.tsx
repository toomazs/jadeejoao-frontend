import type { ComponentPropsWithoutRef } from 'react'

const VARIANT_CLASSES = {
  /** Warm action — terracotta plaque. */
  primary:
    'bg-terracotta text-cream hover:bg-terracotta-deep border border-terracotta hover:border-terracotta-deep',
  /** Quiet action — engraved olive outline on paper. */
  outline: 'border border-olive text-olive hover:bg-olive hover:text-cream',
  /** For dark grounds (terracotta and olive rooms) — a cream plaque. */
  light: 'border border-cream bg-cream text-ink hover:border-gold-sand hover:bg-gold-sand',
} as const

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: keyof typeof VARIANT_CLASSES
}

const BASE_CLASSES =
  'inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 px-8 py-2.5 font-body text-base tracking-[0.1em] uppercase transition-colors'

/** Token-driven button primitive in the engraved-plaque grammar; comfortable touch target. */
export function Button({ type = 'button', variant = 'primary', className = '', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE_CLASSES} disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    />
  )
}

type ButtonLinkProps = ComponentPropsWithoutRef<'a'> & {
  variant?: keyof typeof VARIANT_CLASSES
}

/** Anchor rendered in the same plaque grammar — for links that act like actions (maps, registries). */
export function ButtonLink({ variant = 'primary', className = '', children, ...rest }: ButtonLinkProps) {
  return (
    <a className={`${BASE_CLASSES} no-underline ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
