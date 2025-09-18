# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a React TypeScript Todo List application built with Vite. The main application code is located in `todolist-frontend/`.

### Key Architecture Components

- **Context-based State Management**: Uses React Context for managing todos, categories, themes, and i18n
  - `TodoContext`: Manages todo items, categories, and CRUD operations with localStorage persistence
  - `ThemeContext`: Handles light/dark mode theming
  - `I18nContext`: Manages internationalization
  
- **Component Structure**: 
  - Main components in `src/components/` include TodoList, TodoItem, TodoForm, CategorySelector
  - Modal components for confirmations, category management, and ranking conflicts
  - Theme toggle component for dark/light mode switching

- **TypeScript Types**: Centralized in `src/types/index.ts` with TodoItem and Category interfaces

- **Data Persistence**: Uses localStorage for client-side data persistence (no H2 database implemented yet)

## Development Commands

Navigate to the `todolist-frontend` directory before running these commands:

```bash
cd todolist-frontend
```

- **Development server**: `npm run dev`
- **Build**: `npm run build` (includes TypeScript compilation)
- **Linting**: `npm run lint`
- **Preview production build**: `npm run preview`

## Key Features Implementation

- **Ranking System**: Todo items have rankings 1-100 with color coding (red: 1-3, yellow: 4-6, grey: rest)
- **Drag & Drop**: Uses @dnd-kit library for reordering todos with confirmation modals
- **Category Management**: Support for Personal/Professional goals with ability to add/remove categories
- **Completion Tracking**: Checkbox system with crossed-out styling and automatic list reordering
- **Dark Mode**: Full theme switching capability
- **Internationalization**: i18n support structure in place

## Dependencies

- **UI Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Linting**: ESLint with TypeScript and React plugins configured

## Code Conventions

- Uses React Context pattern for state management
- Functional components with TypeScript interfaces
- localStorage for data persistence
- Component-based architecture with clear separation of concerns
- Date tracking with audit fields (dateCreated, auditDateCreated, auditDateModified)