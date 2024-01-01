/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { ComponentProps, forwardRef } from 'react'
import { clsx } from 'clsx'

function Root(props: ComponentProps<'label'>) {
  return (
    <label htmlFor="" className="mb-5" {...props}>
      {props.children}
    </label>
  )
}

function Label(props: ComponentProps<'span'>) {
  return (
    <span className="text-xs mb-1 block -tracking-wide font-medium" {...props}>
      {props.children}
    </span>
  )
}

const Write = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  (props, ref) => {
    return (
      <input ref={ref} className={clsx('input', props.className)} {...props} />
    )
  },
)

export const Input = {
  Root,
  Label,
  Write,
}
