'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Rocket, Plus } from 'lucide-react'
import { apiClient } from '@/lib/api'
import TaskCard from '@/components/TaskCard'
import EmptyState from '@/components/EmptyState'
import { Task } from '@/lib/models'

export default function HomePage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTasks = await apiClient.getTasks()
      setTasks(fetchedTasks)
    } catch (err) {
      setError('Failed to load tasks')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await apiClient.toggleTask(id, completed)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
    } catch (err) {
      console.error('Error toggling task:', err)
      // Reload tasks to ensure consistency
      loadTasks()
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await apiClient.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      // Reload tasks to ensure consistency
      loadTasks()
    }
  }

  const handleTaskClick = (task: Task) => {
    router.push(`/edit/${task.id}`)
  }

  const handleCreateTask = () => {
    router.push('/create')
  }

  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Rocket className="w-6 h-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-100">Todo App</h1>
        </div>

        {/* Create Task Button */}
        <button
          onClick={handleCreateTask}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>

        {/* Task Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-primary-400 font-medium">
            Tasks {totalCount}
          </div>
          <div className="text-purple-400 font-medium">
            Completed {completedCount} of {totalCount}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onClick={handleTaskClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
