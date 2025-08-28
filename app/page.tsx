'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '../lib/api'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import { Task } from '../lib/models'

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
      <div className="min-h-screen bg-[--figma-bg] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--figma-bg]">
      {/* Black Banner - Responsive height with relative positioning */}
      <div className="relative bg-[--figma-banner] w-full h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 2xl:h-52 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-6 flex items-center justify-center">
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

        {/* Floating Create Task Button - Half in banner, half outside */}
        <button
          onClick={handleCreateTask}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                     bg-[#1E6F9F] hover:bg-[#1E6F9F]/90 text-[#F2F2F2] font-medium 
                     py-3 px-6 rounded-lg shadow-lg transition-all duration-200 
                     flex items-center justify-center gap-3 text-[--figma-text-size] w-full h-14 max-w-2xl"
        >
          Create Task
          <div className="w-5 h-5 flex items-center justify-center">
            <img 
              src="/assets/plus.svg" 
              alt="Plus Icon" 
              className="w-5 h-5"
            />
          </div>
        </button>
      </div>

      {/* Main Content Container with top margin for floating button */}
      <div className="bg-[--figma-bg] min-h-screen mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 xl:px-12">
          {/* Task Summary */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[color:var(--figma-blue)] font-medium text-[--figma-text-size]">Tasks</span>
                <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-[--figma-text-size-sm] font-medium">
                  {totalCount}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[color:var(--figma-purple)] font-medium text-[--figma-text-size]">Completed</span>
                <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-[--figma-text-size] font-medium">
                  {completedCount > 0 && (
                    <>
                      {completedCount} of {totalCount}
                    </>
                  )}
                  {completedCount == 0 && (
                    <>
                      {completedCount}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Divider line - only show when no tasks */}
            {tasks.length === 0 && (
              <div className="w-full h-px bg-[--figma-gray-300] mb-2"></div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Task List */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {/* Incomplete Tasks */}
                  {tasks.filter(task => !task.completed).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onClick={handleTaskClick}
                    />
                  ))}
                  {/* Completed Tasks */}
                  {tasks.filter(task => task.completed).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onClick={handleTaskClick}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
