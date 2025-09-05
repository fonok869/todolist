Make a Responsive React Application using the latest react release to follow our TODO lists.

Core functionnality
1. We have to support dark mode.
2. We can make different categories like, personnal goals, professionnal goals.
3. We can add an item with a ranking a title and a description to a category.
4. When we add a todo item we have a pop-up with the different informations and then we have to confirm it.
3. We can navigate between the different categories and see the title of the TODO and it's ranking.
4. We have to see the list from the top to the bottom starting with the first ranking.
5. Ranking can be from 1 to 100.
6. The first 3 rankings should be red, then the next 3 rankings yellow the others are grey.
7. We can change priority of a todo item with drag and drop, before we save definitely we have a confirmation popup.
8. Every todo item has a checkbox to mark it is completed.
9. When it is completed the item  is crossed out and it goes the end of the list the color of the cell becomes gray.
10. The date of creation can be seen in the list.
11. For every item that is not done yet has a button after the checkbox named "Edit" to modify the item.


For the storage, we should store in a H2 database.
The table has its structure date of creation type date, ranking tye integer, title 100 character maximum, description 500 character maximum, category 100 characters maximum, audit date of creation of item, audit date of modification, done tye boolean.
Audit date of modification should filled every time we change something in the todo list item.
