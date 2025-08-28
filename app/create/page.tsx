'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { apiClient } from '../../lib/api'
import ColorPicker from '../../components/ColorPicker'

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
    <div className="min-h-screen bg-[--figma-bg]">
      {/* Black Banner */}
      <div className="bg-[--figma-banner] w-full h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 2xl:h-52 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/assets/rocket.svg" 
              alt="Rocket Logo" 
              className="w-8 h-8"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Todo App
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 xl:px-12">
        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-[color:var(--figma-blue)]">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Brush you teeth,"
                className="input-field text-[color:var(--figma-gray-100)]"
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
              className="bg-[#1E6F9F] hover:bg-[#1E6F9F]/90 text-[#F2F2F2] font-medium 
                       py-3 px-6 rounded-lg transition-all duration-200 
                       flex items-center justify-center gap-3 shadow-lg text-[--figma-text-size] w-full h-10 max-w-2xl
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Add Task
              {<div className="w-5 h-5 flex items-center justify-center">
                  <img 
                    src="/assets/plus.svg" 
                    alt="Plus Icon" 
                    className="w-5 h-5"
                  />
                </div>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
