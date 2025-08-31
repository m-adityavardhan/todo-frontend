import { apiClient } from '../../lib/api'
import { mockTasks, mockSingleTask, mockCreateTaskData, mockUpdateTaskData } from '../mocks/mockData'

// Mock axios
jest.mock('axios')
const mockAxios = require('axios')

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variable
    delete process.env.NEXT_PUBLIC_API_URL
  })

  describe('getTasks', () => {
    it('fetches all tasks successfully', async () => {
      const mockResponse = {
        status: 200,
        data: mockTasks,
      }
      mockAxios.mockResolvedValue(mockResponse)

      const result = await apiClient.getTasks()

      expect(mockAxios).toHaveBeenCalledWith('http://localhost:5000/api/tasks', {
        method: undefined,
        headers: { 'Content-Type': 'application/json' },
        data: undefined,
      })
      expect(result).toEqual(mockTasks)
    })

    it('uses custom API URL when environment variable is set', async () => {
      // Set environment variable before creating the client
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api'
      
      // Re-import to get fresh instance with new env var
      jest.resetModules()
      const { apiClient: freshApiClient } = require('../../lib/api')
      
      const mockResponse = {
        status: 200,
        data: mockTasks,
      }
      mockAxios.mockResolvedValue(mockResponse)

      await freshApiClient.getTasks()

      expect(mockAxios).toHaveBeenCalledWith('https://api.example.com/api/tasks', {
        method: undefined,
        headers: { 'Content-Type': 'application/json' },
        data: undefined,
      })
    })

    it('handles API errors correctly', async () => {
      const mockResponse = {
        status: 500,
        data: { error: 'Internal server error' },
      }
      mockAxios.mockResolvedValue(mockResponse)

      await expect(apiClient.getTasks()).rejects.toThrow('Internal server error')
    })
  })

  describe('createTask', () => {
    it('creates a task successfully', async () => {
      const mockResponse = {
        status: 201,
        data: mockSingleTask,
      }
      mockAxios.mockResolvedValue(mockResponse)

      const result = await apiClient.createTask(mockCreateTaskData)

      expect(mockAxios).toHaveBeenCalledWith('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(mockCreateTaskData),
      })
      expect(result).toEqual(mockSingleTask)
    })

    it('handles creation errors', async () => {
      const mockResponse = {
        status: 400,
        data: { error: 'Invalid task data' },
      }
      mockAxios.mockResolvedValue(mockResponse)

      await expect(apiClient.createTask(mockCreateTaskData)).rejects.toThrow('Invalid task data')
    })
  })

  describe('updateTask', () => {
    it('updates a task successfully', async () => {
      const mockResponse = {
        status: 200,
        data: { ...mockSingleTask, ...mockUpdateTaskData },
      }
      mockAxios.mockResolvedValue(mockResponse)

      const result = await apiClient.updateTask('1', mockUpdateTaskData)

      expect(mockAxios).toHaveBeenCalledWith('http://localhost:5000/api/tasks/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(mockUpdateTaskData),
      })
      expect(result).toEqual({ ...mockSingleTask, ...mockUpdateTaskData })
    })

    it('handles update errors', async () => {
      const mockResponse = {
        status: 404,
        data: { error: 'Task not found' },
      }
      mockAxios.mockResolvedValue(mockResponse)

      await expect(apiClient.updateTask('999', mockUpdateTaskData)).rejects.toThrow('Task not found')
    })
  })

  describe('deleteTask', () => {
    it('deletes a task successfully', async () => {
      const mockResponse = {
        status: 204,
        data: {},
      }
      mockAxios.mockResolvedValue(mockResponse)

      const result = await apiClient.deleteTask('1')

      expect(mockAxios).toHaveBeenCalledWith('http://localhost:5000/api/tasks/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        data: undefined,
      })
      expect(result).toEqual({})
    })

    it('handles delete errors', async () => {
      const mockResponse = {
        status: 404,
        data: { error: 'Task not found' },
      }
      mockAxios.mockResolvedValue(mockResponse)

      await expect(apiClient.deleteTask('999')).rejects.toThrow('Task not found')
    })
  })

  describe('toggleTask', () => {
    it('toggles task completion successfully', async () => {
      const mockResponse = {
        status: 200,
        data: { ...mockSingleTask, completed: true },
      }
      mockAxios.mockResolvedValue(mockResponse)

      const result = await apiClient.toggleTask('1', true)

      expect(mockAxios).toHaveBeenCalledWith('http://localhost:5000/api/tasks/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ completed: true }),
      })
      expect(result).toEqual({ ...mockSingleTask, completed: true })
    })
  })

  describe('error handling', () => {
    it('handles network errors', async () => {
      const networkError = new Error('Network error')
      mockAxios.mockRejectedValue(networkError)

      await expect(apiClient.getTasks()).rejects.toThrow('Network error')
    })

    it('handles axios errors with response data', async () => {
      const axiosError = {
        response: {
          status: 500,
          data: { error: 'Server error' },
        },
      }
      mockAxios.mockRejectedValue(axiosError)

      await expect(apiClient.getTasks()).rejects.toThrow('Server error')
    })

    it('handles axios errors without response data', async () => {
      const axiosError = new Error('Request failed')
      mockAxios.mockRejectedValue(axiosError)

      await expect(apiClient.getTasks()).rejects.toThrow('Request failed')
    })
  })

  describe('request method', () => {
    it('logs API calls for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      const mockResponse = {
        status: 200,
        data: mockTasks,
      }
      mockAxios.mockResolvedValue(mockResponse)

      await apiClient.getTasks()

      expect(consoleSpy).toHaveBeenCalledWith('calling API endpoint:', 'http://localhost:5000/api/tasks', expect.any(Object))
      consoleSpy.mockRestore()
    })

    it('handles 204 No Content responses correctly', async () => {
      const mockResponse = {
        status: 204,
        data: undefined,
      }
      mockAxios.mockResolvedValue(mockResponse)

      const result = await apiClient.deleteTask('1')

      expect(result).toEqual({})
    })
  })
})
