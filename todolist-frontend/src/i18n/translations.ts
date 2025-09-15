export interface Translations {
  // App Header
  appTitle: string;
  switchToLightMode: string;
  switchToDarkMode: string;

  // Categories
  personalGoals: string;
  professionalGoals: string;
  addCategory: string;
  addNewCategory: string;
  categoryName: string;
  categoryNameRequired: string;
  categoryNamePlaceholder: string;
  categoryAlreadyExists: string;
  removeCategory: string;
  deleteCategoryTitle: string;
  deleteCategoryMessage: string;
  deleteCategoryWarning: string;
  yesDeleteCategory: string;

  // Todo List
  addTodo: string;
  noTodosInCategory: string;
  addFirstTodo: string;
  completed: string;
  dragToReorder: string;

  // Todo Form
  addNewTodo: string;
  editTodo: string;
  title: string;
  titleRequired: string;
  description: string;
  ranking: string;
  rankingRequired: string;
  rankingRange: string;
  cancel: string;
  addTodoButton: string;
  update: string;
  edit: string;

  // Ranking Conflict Modal
  rankingConflictDetected: string;
  rankingConflictMessage: string;
  existingItemAtRanking: string;
  newItemToBeCreated: string;
  created: string;
  itemsMovedDown: string;
  continuousSequenceNote: string;
  doYouWantToProceed: string;
  pushItemsDownMessage: string;
  yesPushItemsDown: string;

  // Confirmation Modal
  confirmReorder: string;
  confirmReorderMessage: string;
  confirm: string;

  // Date formatting
  createdLabel: string;

  // Ranking indicators
  rankingPrefix: string;

  // Actions
  willMoveFrom: string;
  to: string;
  moveFromTo: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // App Header
    appTitle: 'Todo List Manager',
    switchToLightMode: 'Switch to light mode',
    switchToDarkMode: 'Switch to dark mode',

    // Categories
    personalGoals: 'Personal Goals',
    professionalGoals: 'Professional Goals',
    addCategory: '+ Category',
    addNewCategory: 'Add New Category',
    categoryName: 'Category Name',
    categoryNameRequired: 'Category Name *',
    categoryNamePlaceholder: 'Enter category name...',
    categoryAlreadyExists: 'A category with this name already exists!',
    removeCategory: 'Remove category',
    deleteCategoryTitle: 'Delete Category',
    deleteCategoryMessage: 'Are you sure you want to delete the category "{categoryName}"?',
    deleteCategoryWarning: 'This will permanently delete all {todoCount} todo items in this category. This action cannot be undone.',
    yesDeleteCategory: 'Yes, Delete Category',

    // Todo List
    addTodo: '+ Add Todo',
    noTodosInCategory: 'No todos in this category. Add your first todo!',
    addFirstTodo: 'Add your first todo!',
    completed: 'Completed',
    dragToReorder: 'Drag to reorder',

    // Todo Form
    addNewTodo: 'Add New Todo',
    editTodo: 'Edit Todo',
    title: 'Title',
    titleRequired: 'Title *',
    description: 'Description',
    ranking: 'Ranking',
    rankingRequired: 'Ranking (1-100) *',
    rankingRange: '1-100',
    cancel: 'Cancel',
    addTodoButton: 'Add Todo',
    update: 'Update',
    edit: 'Edit',

    // Ranking Conflict Modal
    rankingConflictDetected: 'Ranking Conflict Detected',
    rankingConflictMessage: 'You\'re trying to create a new todo with ranking {rankingPrefix}{ranking}, but this ranking is already taken.',
    existingItemAtRanking: 'Existing Item at Ranking {rankingPrefix}{ranking}:',
    newItemToBeCreated: 'New Item to be Created:',
    created: 'Created',
    itemsMovedDown: 'Items that will be moved down (continuous sequence only):',
    continuousSequenceNote: 'Only consecutive rankings will be affected. Items with gaps (e.g., {rankingPrefix}6, {rankingPrefix}10) will remain unchanged.',
    doYouWantToProceed: 'Do you want to proceed?',
    pushItemsDownMessage: 'This will push the existing item and all items below it down by one ranking.',
    yesPushItemsDown: 'Yes, Push Items Down',

    // Confirmation Modal
    confirmReorder: 'Confirm Reorder',
    confirmReorderMessage: 'Are you sure you want to save this new order?',
    confirm: 'Confirm',

    // Date formatting
    createdLabel: 'Created',

    // Ranking indicators
    rankingPrefix: '#',

    // Actions
    willMoveFrom: 'will move from',
    to: 'to',
    moveFromTo: '{title} will move from {rankingPrefix}{fromRanking} to {rankingPrefix}{toRanking}',
  }
};