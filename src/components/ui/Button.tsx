import type { ComponentPropsWithoutRef } from 'react'

type ButtonProps = ComponentPropsWithoutRef<'button'>

/** Token-driven button primitive with a comfortable touch target. */
export function Button({ type = 'button', className = '', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-olive px-6 py-2 text-cream transition-colors hover:bg-deep-olive disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    />
  )
}
