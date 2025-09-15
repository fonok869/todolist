import React, { createContext, useContext, useState, useEffect } from 'react';
import type {TodoItem, Category} from '../types/index';
import { todoApi } from '../services/api';

interface TodoContextType {
  todos: TodoItem[];
  categories: Category[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  addTodo: (todo: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => Promise<void>;
  addTodoWithRankingShift: (todo: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => Promise<void>;
  checkRankingConflict: (category: string, ranking: number, excludeId?: string) => { conflictingItem?: TodoItem; affectedItems: TodoItem[] };
  updateTodo: (id: string, updates: Partial<TodoItem>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  reorderTodos: (todos: TodoItem[]) => Promise<void>;
  setSelectedCategory: (category: string) => void;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (categoryName: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const BackendTodoContext = createContext<TodoContextType | undefined>(undefined);

export const BackendTodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Personal Goals');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [todosData, categoriesData] = await Promise.all([
        todoApi.getAllTodos(),
        todoApi.getAllCategories()
      ]);
      
      setTodos(todosData);
      setCategories(categoriesData);
      
      // Set selected category to first available if current selection doesn't exist
      if (categoriesData.length > 0 && !categoriesData.find(c => c.name === selectedCategory)) {
        setSelectedCategory(categoriesData[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTodos = async () => {
    try {
      setError(null);
      const todosData = await todoApi.getAllTodos();
      setTodos(todosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh todos');
      console.error('Failed to refresh todos:', err);
    }
  };

  const addTodo = async (todoData: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  };

  // For ranking shift, we'll use the same addTodo function - backend handles ranking conflicts
  const addTodoWithRankingShift = async (todoData: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => {
    return addTodo(todoData);
  };

  const checkRankingConflict = (category: string, ranking: number, excludeId?: string) => {
    // Client-side conflict checking for UI feedback
    const categoryTodos = todos.filter(todo => 
      todo.category === category && 
      !todo.done && 
      (!excludeId || todo.id !== excludeId)
    );
    
    const conflictingItem = categoryTodos.find(todo => todo.ranking === ranking);
    
    if (!conflictingItem) {
      return { conflictingItem: undefined, affectedItems: [] };
    }
    
    const sortedCategoryTodos = [...categoryTodos].sort((a, b) => a.ranking - b.ranking);
    const affectedItems = [];
    let currentRanking = ranking;
    
    for (const todo of sortedCategoryTodos) {
      if (todo.ranking === currentRanking) {
        affectedItems.push(todo);
        currentRanking++;
      } else if (todo.ranking > currentRanking) {
        break;
      }
    }
    
    return { conflictingItem, affectedItems };
  };

  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.toggleTodo(id);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      throw err;
    }
  };

  const reorderTodos = async (newTodos: TodoItem[]) => {
    try {
      setError(null);
      const reorderedTodos = await todoApi.reorderTodos(newTodos);
      
      // Update local state with reordered todos
      setTodos(prev => {
        const otherCategoryTodos = prev.filter(todo => 
          !newTodos.find(nt => nt.id === todo.id)
        );
        return [...otherCategoryTodos, ...reorderedTodos];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder todos');
      throw err;
    }
  };

  const addCategory = async (name: string) => {
    try {
      setError(null);
      const newCategory = await todoApi.createCategory(name);
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  };

  const removeCategory = async (categoryName: string) => {
    try {
      setError(null);
      await todoApi.deleteCategory(categoryName);
      
      // Remove todos in this category and update state
      setTodos(prev => prev.filter(todo => todo.category !== categoryName));
      setCategories(prev => prev.filter(category => category.name !== categoryName));
      
      // If the removed category was selected, switch to the first available category
      if (selectedCategory === categoryName) {
        const remainingCategories = categories.filter(category => category.name !== categoryName);
        if (remainingCategories.length > 0) {
          setSelectedCategory(remainingCategories[0].name);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  };

  return (
    <BackendTodoContext.Provider value={{
      todos,
      categories,
      selectedCategory,
      loading,
      error,
      addTodo,
      addTodoWithRankingShift,
      checkRankingConflict,
      updateTodo,
      deleteTodo,
      toggleTodo,
      reorderTodos,
      setSelectedCategory,
      addCategory,
      removeCategory,
      refreshTodos,
    }}>
      {children}
    </BackendTodoContext.Provider>
  );
};

export const useBackendTodos = () => {
  const context = useContext(BackendTodoContext);
  if (context === undefined) {
    throw new Error('useBackendTodos must be used within a BackendTodoProvider');
  }
  return context;
};