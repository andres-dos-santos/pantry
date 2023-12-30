import { Check, X } from 'lucide-react'
import { toast as hotToast, Toaster } from 'react-hot-toast'

interface Props {
  message: string
  type: 'success' | 'error'
}

export function toast({ message, type }: Props) {
  return hotToast(message, {
    icon:
      type === 'success' ? (
        <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 font-bold text-white" />
        </div>
      ) : (
        <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 font-bold text-white" />
        </div>
      ),
    className: 'toast',
    position: 'bottom-center',
  })
}

export const Toast = Toaster
