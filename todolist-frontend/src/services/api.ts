import type { TodoItem, Category } from '../types/index';
import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:8080/api';

// API interfaces to match backend DTOs
interface TodoDto {
  id?: number;
  title: string;
  description: string;
  ranking: number;
  done: boolean;
  dateCreated?: string;
  auditDateCreated?: string;
  auditDateModified?: string;
  categoryName: string;
  categoryId?: number;
}

interface CategoryDto {
  id?: number;
  name: string;
  dateCreated?: string;
  auditDateCreated?: string;
  auditDateModified?: string;
  todoCount?: number;
}

// Utility functions to convert between frontend and backend formats
const convertToBackendTodo = (todo: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>): Omit<TodoDto, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'> => ({
  title: todo.title,
  description: todo.description,
  ranking: todo.ranking,
  done: todo.done,
  categoryName: todo.category,
});

const convertToFrontendTodo = (dto: TodoDto): TodoItem => ({
  id: dto.id?.toString() || '',
  title: dto.title,
  description: dto.description,
  ranking: dto.ranking,
  done: dto.done,
  category: dto.categoryName,
  dateCreated: dto.dateCreated ? new Date(dto.dateCreated) : new Date(),
  auditDateCreated: dto.auditDateCreated ? new Date(dto.auditDateCreated) : new Date(),
  auditDateModified: dto.auditDateModified ? new Date(dto.auditDateModified) : new Date(),
});

const convertToFrontendCategory = (dto: CategoryDto): Category => ({
  id: dto.id?.toString() || '',
  name: dto.name,
});

// API functions
export const todoApi = {
  // Todo operations
  async getAllTodos(): Promise<TodoItem[]> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch todos');
    const todos: TodoDto[] = await response.json();
    return todos.map(convertToFrontendTodo);
  },

  async getTodosByCategory(categoryName: string): Promise<TodoItem[]> {
    const response = await fetch(`${API_BASE_URL}/todos/category/${encodeURIComponent(categoryName)}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch todos for category: ${categoryName}`);
    const todos: TodoDto[] = await response.json();
    return todos.map(convertToFrontendTodo);
  },

  async createTodo(todo: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(convertToBackendTodo(todo)),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create todo');
    }
    const createdTodo: TodoDto = await response.json();
    return convertToFrontendTodo(createdTodo);
  },

  async updateTodo(id: string, updates: Partial<TodoItem>): Promise<TodoItem> {
    // First get the current todo to ensure we have all required fields
    const currentResponse = await fetch(`${API_BASE_URL}/todos/${id}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!currentResponse.ok) throw new Error('Failed to fetch current todo');
    const currentTodo: TodoDto = await currentResponse.json();

    // If category is being updated, get the category ID
    let categoryId = currentTodo.categoryId;
    let categoryName = currentTodo.categoryName;

    if (updates.category !== undefined && updates.category !== currentTodo.categoryName) {
      // Get category by name to find its ID
      const categoryResponse = await fetch(`${API_BASE_URL}/categories/name/${encodeURIComponent(updates.category)}`, {
        headers: authService.getAuthHeaders(),
      });
      if (!categoryResponse.ok) throw new Error('Failed to find category');
      const category: CategoryDto = await categoryResponse.json();
      categoryId = category.id;
      categoryName = updates.category;
    }

    // Create update object with current values as defaults, then override with updates
    const todoUpdate: TodoDto = {
      id: currentTodo.id,
      title: updates.title !== undefined ? updates.title : currentTodo.title,
      description: updates.description !== undefined ? updates.description : currentTodo.description,
      ranking: updates.ranking !== undefined ? updates.ranking : currentTodo.ranking,
      done: updates.done !== undefined ? updates.done : currentTodo.done,
      categoryName: categoryName,
      categoryId: categoryId,
      dateCreated: currentTodo.dateCreated,
      auditDateCreated: currentTodo.auditDateCreated,
      auditDateModified: currentTodo.auditDateModified,
    };

    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(todoUpdate),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    const updatedTodo: TodoDto = await response.json();
    return convertToFrontendTodo(updatedTodo);
  },

  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },

  async toggleTodo(id: string): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle todo');
    const toggledTodo: TodoDto = await response.json();
    return convertToFrontendTodo(toggledTodo);
  },

  async reorderTodos(todos: TodoItem[]): Promise<TodoItem[]> {
    const backendTodos: TodoDto[] = todos.map(todo => ({
      id: parseInt(todo.id),
      title: todo.title,
      description: todo.description,
      ranking: todo.ranking,
      done: todo.done,
      categoryName: todo.category,
    }));

    const response = await fetch(`${API_BASE_URL}/todos/reorder`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(backendTodos),
    });
    if (!response.ok) throw new Error('Failed to reorder todos');
    const reorderedTodos: TodoDto[] = await response.json();
    return reorderedTodos.map(convertToFrontendTodo);
  },

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const categories: CategoryDto[] = await response.json();
    return categories.map(convertToFrontendCategory);
  },

  async createCategory(name: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }
    const createdCategory: CategoryDto = await response.json();
    return convertToFrontendCategory(createdCategory);
  },

  async deleteCategory(categoryName: string): Promise<void> {
    // First get the category to find its ID
    const response = await fetch(`${API_BASE_URL}/categories/name/${encodeURIComponent(categoryName)}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to find category');
    const category: CategoryDto = await response.json();
    
    // Then delete by ID
    const deleteResponse = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!deleteResponse.ok) throw new Error('Failed to delete category');
  },
};

export default todoApi;