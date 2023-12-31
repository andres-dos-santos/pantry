/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { ComponentProps, forwardRef } from 'react'

function Root(props: ComponentProps<'label'>) {
  return (
    <label htmlFor="" className="mb-3" {...props}>
      {props.children}
    </label>
  )
}

function Label(props: ComponentProps<'span'>) {
  return (
    <span className="text-xs ml-1 mb-1 block font-medium" {...props}>
      {props.children}
    </span>
  )
}

const Write = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        className="rounded-2xl capitalize bg-zinc-100/50 h-12 w-full text-[13px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
        {...props}
      />
    )
  },
)

export const Input = {
  Root,
  Label,
  Write,
}
