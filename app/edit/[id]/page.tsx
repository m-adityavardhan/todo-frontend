'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { apiClient } from '../../../lib/api'
import ColorPicker from '../../../components/ColorPicker'
import { Task } from '../../../lib/models'

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('blue')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTask()
  }, [taskId])

  const loadTask = async () => {
    try {
      setLoading(true)
      setError(null)
      const tasks = await apiClient.getTasks()
      const foundTask = tasks.find(t => t.id === taskId)

      if (!foundTask) {
        setError('Task not found')
        return
      }

      setTask(foundTask)
      setTitle(foundTask.title)
      setColor(foundTask.color)
    } catch (err) {
      setError('Failed to load task')
      console.error('Error loading task:', err)
    } finally {
      setLoading(false)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      await apiClient.updateTask(taskId, {
        title: title.trim(),
        color
      })
      router.push('/')
    } catch (err) {
      setError('Failed to update task')
      console.error('Error updating task:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="text-xl font-semibold text-gray-100">Error</h1>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-semibold text-gray-100">Detail View</h1>
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
              disabled={saving}
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
            disabled={saving || !title.trim()}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Check className="w-5 h-5" />
            )}
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
