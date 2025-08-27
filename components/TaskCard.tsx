'use client'

import { useState } from 'react'
import { Trash2, Square, CheckSquare } from 'lucide-react'
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
  purple: 'bg-task-purple',
  pink: 'bg-task-pink',
  brown: 'bg-task-brown',
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
      className={`task-card cursor-pointer group animate-slide-up ${
        isDeleting ? 'opacity-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {/* Color indicator */}
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${
            colorClasses[task.color as keyof typeof colorClasses] || 'bg-task-blue'
          }`}
        />
        
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-colors"
          disabled={isDeleting}
        >
          {task.completed ? (
            <CheckSquare className="w-5 h-5 text-purple-500" />
          ) : (
            <Square className="w-5 h-5 text-blue-500" />
          )}
        </button>

        {/* Task title */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              task.completed
                ? 'line-through text-gray-400'
                : 'text-gray-200'
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
