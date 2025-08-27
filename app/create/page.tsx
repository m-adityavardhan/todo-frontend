'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { apiClient } from '@/lib/api'
import ColorPicker from '@/components/ColorPicker'

export default function CreateTaskPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('blue')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await apiClient.createTask({
        title: title.trim(),
        color
      })
      router.push('/')
    } catch (err) {
      setError('Failed to create task')
      console.error('Error creating task:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-gray-100">Added Task</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Brush you teeth,"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Color Picker */}
          <ColorPicker
            selectedColor={color}
            onColorChange={setColor}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
