import { ClipboardList } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-300 mb-2">
        You don&apos;t have any tasks registered yet.
      </h3>
      <p className="text-gray-400 max-w-sm">
        Create tasks and organize your to-do items.
      </p>
    </div>
  )
}
