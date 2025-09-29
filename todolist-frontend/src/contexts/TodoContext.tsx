import React, { createContext, useContext, useState, useEffect } from 'react';
import type {TodoItem, Category} from '../types/index';

interface TodoContextType {
  todos: TodoItem[];
  categories: Category[];
  selectedCategory: string;
  addTodo: (todo: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => void;
  addTodoWithRankingShift: (todo: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => void;
  checkRankingConflict: (category: string, ranking: number, excludeId?: string) => { conflictingItem?: TodoItem; affectedItems: TodoItem[] };
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  reorderTodos: (todos: TodoItem[]) => void;
  setSelectedCategory: (category: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (categoryName: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const getDefaultCategories = (): Category[] => [
  { id: '1', name: 'Personal Goals' }, // This will be replaced by translation
  { id: '2', name: 'Professional Goals' }, // This will be replaced by translation
];

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(getDefaultCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('Personal Goals');
  const [actionCooldown, setActionCooldown] = useState<number>(0);

  const validateTodoData = (data: unknown[]): boolean => {
    return Array.isArray(data) && data.every(todo => 
      typeof todo === 'object' && 
      todo !== null &&
      typeof (todo as { id?: unknown }).id === 'string' &&
      typeof (todo as { title?: unknown }).title === 'string' &&
      typeof (todo as { description?: unknown }).description === 'string' &&
      typeof (todo as { ranking?: unknown }).ranking === 'number' &&
      typeof (todo as { done?: unknown }).done === 'boolean'
    );
  };

  const validateCategoryData = (data: unknown[]): boolean => {
    return Array.isArray(data) && data.every(category => 
      typeof category === 'object' &&
      category !== null &&
      typeof (category as { id?: unknown }).id === 'string' &&
      typeof (category as { name?: unknown }).name === 'string'
    );
  };

  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('anonymous_todos');
      if (savedTodos) {
        const parsed = JSON.parse(savedTodos);
        if (validateTodoData(parsed)) {
          setTodos(parsed.map((todo: unknown) => {
            const t = todo as {
              id: string;
              title: string;
              description: string;
              category: string;
              ranking: number;
              done: boolean;
              dateCreated: string;
              auditDateCreated: string;
              auditDateModified: string;
            };
            return {
              ...t,
              dateCreated: new Date(t.dateCreated),
              auditDateCreated: new Date(t.auditDateCreated),
              auditDateModified: new Date(t.auditDateModified),
            };
          }));
        } else {
          console.warn('Invalid todo data format, resetting');
          localStorage.removeItem('anonymous_todos');
        }
      }
    } catch {
      console.warn('Invalid localStorage todos data, resetting');
      localStorage.removeItem('anonymous_todos');
    }

    try {
      const savedCategories = localStorage.getItem('anonymous_categories');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (validateCategoryData(parsed)) {
          setCategories(parsed);
        } else {
          console.warn('Invalid category data format, using defaults');
          localStorage.removeItem('anonymous_categories');
        }
      }
    } catch (error) {
      console.warn('Invalid localStorage categories data, using defaults');
      localStorage.removeItem('anonymous_categories');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anonymous_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('anonymous_categories', JSON.stringify(categories));
  }, [categories]);

  const addTodo = (todoData: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => {
    // Rate limiting: prevent rapid todo creation
    if (Date.now() - actionCooldown < 1000) return;
    setActionCooldown(Date.now());

    const now = new Date();
    const newTodo: TodoItem = {
      ...todoData,
      id: Date.now().toString(),
      dateCreated: now,
      auditDateCreated: now,
      auditDateModified: now,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const addTodoWithRankingShift = (todoData: Omit<TodoItem, 'id' | 'dateCreated' | 'auditDateCreated' | 'auditDateModified'>) => {
    const now = new Date();
    const newTodo: TodoItem = {
      ...todoData,
      id: Date.now().toString(),
      dateCreated: now,
      auditDateCreated: now,
      auditDateModified: now,
    };
    
    setTodos(prev => {
      const categoryTodos = prev.filter(todo => todo.category === todoData.category);
      const otherTodos = prev.filter(todo => todo.category !== todoData.category);
      
      // Only consider incomplete todos for ranking shifts
      const incompleteCategoryTodos = categoryTodos.filter(todo => !todo.done);
      
      // Sort incomplete todos by ranking to find continuous sequence
      const sortedIncompleteTodos = [...incompleteCategoryTodos].sort((a, b) => a.ranking - b.ranking);
      
      // Find items that need to be shifted (continuous sequence starting from new ranking)
      const itemsToShift: TodoItem[] = [];
      let currentRanking = todoData.ranking;
      
      for (const todo of sortedIncompleteTodos) {
        if (todo.ranking === currentRanking) {
          itemsToShift.push(todo);
          currentRanking++;
        } else if (todo.ranking > currentRanking) {
          break; // Gap found, stop shifting
        }
      }
      
      // Apply shifts only to continuous incomplete items
      const updatedCategoryTodos = categoryTodos.map(todo => {
        const itemToShift = itemsToShift.find(item => item.id === todo.id);
        if (itemToShift && !todo.done) {
          return {
            ...todo,
            ranking: todo.ranking + 1,
            auditDateModified: now,
          };
        }
        return todo;
      });
      
      return [...otherTodos, ...updatedCategoryTodos, newTodo];
    });
  };

  const checkRankingConflict = (category: string, ranking: number, excludeId?: string) => {
    // Only consider incomplete todos for ranking conflicts
    const categoryTodos = todos.filter(todo => 
      todo.category === category && 
      !todo.done && // Exclude completed items
      (!excludeId || todo.id !== excludeId)
    );
    
    const conflictingItem = categoryTodos.find(todo => todo.ranking === ranking);
    
    if (!conflictingItem) {
      return { conflictingItem: undefined, affectedItems: [] };
    }
    
    // Sort incomplete todos by ranking to find continuous sequence
    const sortedCategoryTodos = [...categoryTodos].sort((a, b) => a.ranking - b.ranking);
    
    // Find items that will be affected (continuous sequence starting from conflict ranking)
    const affectedItems = [];
    let currentRanking = ranking;
    
    for (const todo of sortedCategoryTodos) {
      if (todo.ranking === currentRanking) {
        affectedItems.push(todo);
        currentRanking++;
      } else if (todo.ranking > currentRanking) {
        break; // Gap found, stop
      }
    }
    
    return { conflictingItem, affectedItems };
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, auditDateModified: new Date() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newDoneStatus = !todo.done;
    
    setTodos(prev => {
      const now = new Date();
      
      // Update the toggled todo
      const updatedTodos = prev.map(t => 
        t.id === id 
          ? { ...t, done: newDoneStatus, auditDateModified: now }
          : t
      );
      
      // If marking as done, no ranking adjustments needed
      // If marking as undone, no automatic ranking adjustments needed
      // The user can manually set a new ranking if desired
      
      return updatedTodos;
    });
  };

  const reorderTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const removeCategory = (categoryName: string) => {
    // Remove all todos in this category
    setTodos(prev => prev.filter(todo => todo.category !== categoryName));
    
    // Remove the category
    setCategories(prev => prev.filter(category => category.name !== categoryName));
    
    // If the removed category was selected, switch to the first available category
    if (selectedCategory === categoryName) {
      const remainingCategories = categories.filter(category => category.name !== categoryName);
      if (remainingCategories.length > 0) {
        setSelectedCategory(remainingCategories[0].name);
      }
    }
  };

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      selectedCategory,
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
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};