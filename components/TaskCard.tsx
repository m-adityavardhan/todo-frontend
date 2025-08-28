'use client'

import { useState } from 'react'
import { Trash2, Check } from 'lucide-react'
import { Task } from '../lib/models'

interface TaskCardProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onClick: (task: Task) => void
}

const colorClasses = {
  red: 'bg-task-red',
  orange: 'bg-task-orange',
  yellow: 'bg-task-yellow',
  green: 'bg-task-green',
  blue: 'bg-task-blue',
  indigo: 'bg-task-indigo',
  purple: 'bg-task-purple',
  pink: 'bg-task-pink',
  brown: 'bg-task-brown',
}

const borderColorClasses = {
  red: 'border-task-red',
  orange: 'border-task-orange',
  yellow: 'border-task-yellow',
  green: 'border-task-green',
  blue: 'border-task-blue',
  indigo: 'border-task-indigo',
  purple: 'border-task-purple',
  pink: 'border-task-pink',
  brown: 'border-task-brown',
}

export default function TaskCard({ task, onToggle, onDelete, onClick }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await onToggle(task.id, !task.completed)
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      try {
        await onDelete(task.id)
      } catch (error) {
        console.error('Failed to delete task:', error)
        setIsDeleting(false)
      }
    }
  }

  const handleClick = () => {
    onClick(task)
  }

  return (
    <div
      className={`bg-[--figma-gray-500] border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors duration-200 cursor-pointer group animate-slide-up ${
        isDeleting ? 'opacity-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {/* Color indicator */}
        
        
        {/* Circular Checkbox */}
        <button
          onClick={handleToggle}
          className="flex-shrink-0 p-1 hover:bg-gray-700 rounded-full transition-colors"
          disabled={isDeleting}
        >
          {task.completed ? (
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${colorClasses[task.color as keyof typeof colorClasses]} opacity-70`}>
              <Check className="w-3 h-3 text-white" />
            </div>
          ) : (
            <div className={`w-5 h-5 border-2 rounded-full hover:bg-opacity-10 transition-colors ${borderColorClasses[task.color as keyof typeof borderColorClasses]}`}>
            </div>
          )}
        </button>

        {/* Task title */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              task.completed
                ? 'line-through text-[--figma-gray-400]'
                : 'text-[--figma-gray-100]'
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
