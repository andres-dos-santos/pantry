/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { ComponentProps, forwardRef } from 'react'
import { clsx } from 'clsx'
import { MaskedInput, createDefaultMaskGenerator } from 'react-hook-mask'

function Root(props: ComponentProps<'label'>) {
  return (
    <label htmlFor="" className="mb-5" {...props}>
      {props.children}
    </label>
  )
}

function Label(
  props: ComponentProps<'span'> & { required?: boolean; error?: string },
) {
  return (
    <span
      className="text-xs mb-1.5 block -tracking-wide font-medium"
      {...props}
    >
      {props.children}{' '}
      <span className="text-sm font-semibold text-red-500">
        {props.required ? '*' : null}
      </span>
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

interface MaskProps
  extends Omit<
    ComponentProps<typeof MaskedInput>,
    'value' | 'onChange' | 'maskGenerator'
  > {
  value?: string
  onChange?: any
  mask: string
}

const Mask = forwardRef<HTMLInputElement, MaskProps>((props, ref) => {
  return (
    <MaskedInput
      ref={ref}
      value={props.value ?? ''}
      maskGenerator={createDefaultMaskGenerator(props.mask)}
      onChange={props.onChange}
      className={clsx('input', props.className)}
      {...props}
    />
  )
})

export const Input = {
  Root,
  Label,
  Write,
  Mask,
}
