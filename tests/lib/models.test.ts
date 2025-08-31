import { Task, CreateTaskData, UpdateTaskData } from '../../lib/models'

describe('Data Models', () => {
  describe('Task Interface', () => {
    it('should have all required properties', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        color: 'blue',
        completed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      }

      expect(task.id).toBeDefined()
      expect(task.title).toBeDefined()
      expect(task.color).toBeDefined()
      expect(task.completed).toBeDefined()
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
    })

    it('should allow valid color values', () => {
      const validColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'brown']
      
      validColors.forEach(color => {
        const task: Task = {
          id: '1',
          title: 'Test Task',
          color,
          completed: false,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        }
        
        expect(task.color).toBe(color)
      })
    })

    it('should handle boolean completed status', () => {
      const completedTask: Task = {
        id: '1',
        title: 'Completed Task',
        color: 'green',
        completed: true,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      }

      const incompleteTask: Task = {
        id: '2',
        title: 'Incomplete Task',
        color: 'red',
        completed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      }

      expect(completedTask.completed).toBe(true)
      expect(incompleteTask.completed).toBe(false)
    })

    it('should handle ISO date strings', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        color: 'blue',
        completed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      }

      expect(() => new Date(task.createdAt)).not.toThrow()
      expect(() => new Date(task.updatedAt)).not.toThrow()
      
      const createdDate = new Date(task.createdAt)
      const updatedDate = new Date(task.updatedAt)
      
      expect(createdDate.getFullYear()).toBe(2025)
      expect(updatedDate.getFullYear()).toBe(2025)
    })
  })

  describe('CreateTaskData Interface', () => {
    it('should have required properties for task creation', () => {
      const createData: CreateTaskData = {
        title: 'New Task',
        color: 'purple',
      }

      expect(createData.title).toBeDefined()
      expect(createData.color).toBeDefined()
      expect(createData.title).toBe('New Task')
      expect(createData.color).toBe('purple')
    })

    it('should allow empty title string', () => {
      const createData: CreateTaskData = {
        title: '',
        color: 'blue',
      }

      expect(createData.title).toBe('')
    })

    it('should allow long titles', () => {
      const longTitle = 'A'.repeat(1000)
      const createData: CreateTaskData = {
        title: longTitle,
        color: 'red',
      }

      expect(createData.title).toBe(longTitle)
    })
  })

  describe('UpdateTaskData Interface', () => {
    it('should have all properties as optional', () => {
      const updateData: UpdateTaskData = {}

      expect(updateData.title).toBeUndefined()
      expect(updateData.color).toBeUndefined()
      expect(updateData.completed).toBeUndefined()
    })

    it('should allow partial updates', () => {
      const titleOnlyUpdate: UpdateTaskData = {
        title: 'Updated Title',
      }

      const colorOnlyUpdate: UpdateTaskData = {
        color: 'green',
      }

      const completedOnlyUpdate: UpdateTaskData = {
        completed: true,
      }

      expect(titleOnlyUpdate.title).toBe('Updated Title')
      expect(titleOnlyUpdate.color).toBeUndefined()
      expect(titleOnlyUpdate.completed).toBeUndefined()

      expect(colorOnlyUpdate.title).toBeUndefined()
      expect(colorOnlyUpdate.color).toBe('green')
      expect(colorOnlyUpdate.completed).toBeUndefined()

      expect(completedOnlyUpdate.title).toBeUndefined()
      expect(completedOnlyUpdate.color).toBeUndefined()
      expect(completedOnlyUpdate.completed).toBe(true)
    })

    it('should allow full updates', () => {
      const fullUpdate: UpdateTaskData = {
        title: 'Fully Updated Task',
        color: 'orange',
        completed: false,
      }

      expect(fullUpdate.title).toBe('Fully Updated Task')
      expect(fullUpdate.color).toBe('orange')
      expect(fullUpdate.completed).toBe(false)
    })
  })

  describe('Type Compatibility', () => {
    it('should allow Task to be used where UpdateTaskData is expected', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        color: 'blue',
        completed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      }

      // This should compile without errors
      const updateData: UpdateTaskData = {
        title: task.title,
        color: task.color,
        completed: task.completed,
      }

      expect(updateData.title).toBe(task.title)
      expect(updateData.color).toBe(task.color)
      expect(updateData.completed).toBe(task.completed)
    })

    it('should allow CreateTaskData to be used for partial Task creation', () => {
      const createData: CreateTaskData = {
        title: 'New Task',
        color: 'purple',
      }

      // Simulate creating a task with default values
      const task: Task = {
        id: 'generated-id',
        title: createData.title,
        color: createData.color,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      expect(task.title).toBe(createData.title)
      expect(task.color).toBe(createData.color)
      expect(task.completed).toBe(false)
    })
  })

  describe('Data Validation', () => {
    it('should handle edge cases for color values', () => {
      const edgeCaseColors = ['', 'RED', 'Blue', 'BLUE', 'blue ']
      
      edgeCaseColors.forEach(color => {
        const task: Task = {
          id: '1',
          title: 'Test Task',
          color,
          completed: false,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        }
        
        expect(task.color).toBe(color)
      })
    })

    it('should handle edge cases for title values', () => {
      const edgeCaseTitles = ['', '   ', 'A', 'A'.repeat(10000)]
      
      edgeCaseTitles.forEach(title => {
        const createData: CreateTaskData = {
          title,
          color: 'blue',
        }
        
        expect(createData.title).toBe(title)
      })
    })
  })
})
