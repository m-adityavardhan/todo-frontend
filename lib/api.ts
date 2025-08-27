import axios from "axios";
import { CreateTaskData, Task, UpdateTaskData } from "./models"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {

  // Get all tasks
  async getTasks(): Promise<Task[]> {
    console.log("Fetching all tasks")
    return this.request<Task[]>('/tasks')
  }

  // Create a new task
  async createTask(data: CreateTaskData): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Update a task
  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Toggle task completion
  async toggleTask(id: string, completed: boolean): Promise<Task> {
    return this.updateTask(id, { completed })
  }

    
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    try {
      const axiosConfig = {
        method: options.method,
        headers: headers as Record<string, string> | undefined,
        data: options.body,
      }
      console.log('calling API endpoint:', url,axiosConfig)
      const axiosResponse = await axios(url, axiosConfig)
      const response = {
        ok: axiosResponse.status >= 200 && axiosResponse.status < 300,
        status: axiosResponse.status,
        json: async () => axiosResponse.data,
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

}

export const apiClient = new ApiClient()
