import { Task, CreateTaskData, UpdateTaskData } from '../../lib/models'

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    color: 'blue',
    completed: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Review code changes',
    color: 'green',
    completed: true,
    createdAt: '2025-01-14T09:00:00Z',
    updatedAt: '2025-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: 'Setup testing environment',
    color: 'orange',
    completed: false,
    createdAt: '2025-01-13T14:00:00Z',
    updatedAt: '2025-01-13T14:00:00Z',
  },
]

export const mockSingleTask: Task = mockTasks[0]

export const mockCreateTaskData: CreateTaskData = {
  title: 'New test task',
  color: 'purple',
}

export const mockUpdateTaskData: UpdateTaskData = {
  title: 'Updated task title',
  completed: true,
}

export const mockApiResponse = {
  success: true,
  data: mockTasks,
}

export const mockErrorResponse = {
  error: 'Something went wrong',
  status: 500,
}
