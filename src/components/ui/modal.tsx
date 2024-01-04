import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ComponentProps } from 'react'

function Root(props: ComponentProps<typeof Dialog.Root>) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-white/30 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
        {props.children}
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Content(props: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Content className="mt-10 data-[state=open]:animate-contentShow border border-zinc-200 fixed top-[25%] sm:top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[5px] bg-white focus:outline-none">
      {props.children}
    </Dialog.Content>
  )
}

function Header(props: ComponentProps<'header'>) {
  return (
    <header
      className="flex items-center justify-between p-5 border-b border-b-zinc-200 bg-zinc-100 rounded-t-[5px]"
      {...props}
    >
      <Dialog.Title className="text-sm font-semibold uppercase">
        {props.children}
      </Dialog.Title>

      <Dialog.Close asChild>
        <button>
          <X className="w-5 h-5" />
        </button>
      </Dialog.Close>
    </header>
  )
}

export const Modal = {
  Root,
  Content,
  Header,
}
