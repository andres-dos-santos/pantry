import { ComponentProps } from 'react'
import * as Check from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

interface RootProps
  extends Omit<ComponentProps<typeof Check.Root>, 'onCheckedChange'> {
  onCheckedChange?(value: boolean): void
}

export function Root(props: RootProps) {
  return (
    <div className="flex items-center">
      <Check.Root
        className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[5px] border border-zinc-200 bg-zinc-100/50"
        {...props}
      >
        <Check.Indicator className="text-zinc-800">
          <CheckIcon className="w-4 h-4" />
        </Check.Indicator>
      </Check.Root>

      {props.children}
    </div>
  )
}

export function Label(props: ComponentProps<'label'>) {
  return (
    <label className="pl-2.5 text-[13px] font-medium -tracking-wide leading-none">
      {props.children}
    </label>
  )
}

export const Checkbox = {
  Root,
  Label,
}
