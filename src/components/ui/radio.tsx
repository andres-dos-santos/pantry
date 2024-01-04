/* eslint-disable react/display-name */
import { ComponentProps, forwardRef } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'

function Root(props: ComponentProps<typeof RadioGroup.Root>) {
  return (
    <RadioGroup.Root className="flex items-center space-x-1.5" {...props}>
      {props.children}
    </RadioGroup.Root>
  )
}

const Item = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof RadioGroup.Item>
>((props, ref) => {
  return (
    <>
      <RadioGroup.Item
        {...props}
        className="data-[state=checked]:ring-2 data-[state=checked]:ring-blue-200 data-[state=checked]:border-blue-500 border border-zinc-100 bg-zinc-100 rounded-[5px] h-10 w-10 text-[11px] font-semibold flex items-center justify-center -tracking-wide"
        ref={ref}
      ></RadioGroup.Item>
      <label className="text-[13px] font-medium absolute left-1/2 top-1/2 mr-[50%] -translate-x-[50%] -translate-y-[50%] leading-none">
        {props.children}
      </label>
    </>
  )
})

export const Radio = {
  Root,
  Item,
}
