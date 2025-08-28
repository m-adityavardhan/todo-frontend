import { ClipboardList } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 flex items-center justify-center mb-4">
        <img 
          src="/assets/Clipboard.svg" 
          alt="Clipboard Icon" 
          className="w-16 h-16"
        />
      </div>
      <h3 className="font-bold text-base leading-[1.4] tracking-normal text-center text-[--figma-text] mb-2">
        You don&apos;t have any tasks registered yet.
      </h3>
      <h3 className="font-normal text-base leading-[1.4] tracking-normal text-center text-[--figma-text]">
        Create tasks and organize your to-do items.
      </h3>
    </div>
  )
}
