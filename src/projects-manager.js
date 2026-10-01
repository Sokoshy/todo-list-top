import { createProject } from "./project.js";
import { Todo } from "./todo.js";

const projectsManager = (() => {
  const projects = [];
  const defaultProject = createProject("Default");

  projects.push(defaultProject);

const getProjects = () => projects;

  // Why replace the content instead of the array: getProjects hands out
  // the live array, so emptying and refilling it keeps every reader in sync
  const setProjects = (newProjects) => {
    projects.length = 0;
    newProjects.forEach((project) => {
      projects.push(project);
    });
  };

  const getProjectById = (id) => {
     const project = projects.find((project) => project.id === id );
     if (project === undefined) {
       return null;
     }
     return project;
   };
const toggleTodo = (projectId, todoId) => {
    const project = getProjectById(projectId);
    if (project === null) {
      return null;
    }
    const todo = project.todos.find((item) => item.id === todoId);
    if (todo === undefined) {
      return null;
    }
    const nextDone = !todo.isDone();
    if (todo.checklist === null) {
      todo.done = nextDone;
    } else {
      todo.checklist.forEach((item) => {
        item.done = nextDone;
      });
    }
    return todo;
  };

  const deleteTodo = (projectId, todoId) => {
    const project = getProjectById(projectId);
    if (project === null) {
      return null;
    }
    const index = project.todos.findIndex((item) => item.id === todoId);
    if (index === -1) {
      return null;
    }
    // Why an id instead of an index as identity: removing here shifts every later index
    const [deleted] = project.todos.splice(index, 1);
    return deleted;
  };
const addChecklistItem = (projectId, todoId, texte) => {
    const project = getProjectById(projectId);
    if (project === null) {
      return null;
    }
    const todo = project.todos.find((item) => item.id === todoId);
    if (todo === undefined) {
      return null;
    }
    // First item ever: the absent checklist becomes an existing one
    if (todo.checklist === null) {
      todo.checklist = [];
    }
    const item = { texte, done: false };
    todo.checklist.push(item);
    return item;
  };

  const toggleChecklistItem = (projectId, todoId, index) => {
    const project = getProjectById(projectId);
    if (project === null) {
      return null;
    }
    const todo = project.todos.find((item) => item.id === todoId);
    if (todo === undefined || todo.checklist === null) {
      return null;
    }
    const item = todo.checklist[index];
    if (item === undefined) {
      return null;
    }
    item.done = !item.done;
    return item;
  };

  const deleteChecklistItem = (projectId, todoId, index) => {
    const project = getProjectById(projectId);
    if (project === null) {
      return null;
    }
    const todo = project.todos.find((item) => item.id === todoId);
    if (todo === undefined || todo.checklist === null) {
      return null;
    }
    if (index < 0 || index >= todo.checklist.length) {
      return null;
    }
    const [deleted] = todo.checklist.splice(index, 1);
    return deleted;
  };

  const updateTodo = (projectId, todoId, updates) => {
    const project = getProjectById(projectId);
    if (project === null) {
      return null;
    }
    const todo = project.todos.find((item) => item.id === todoId);
    if (todo === undefined) {
      return null;
    }
    // Only known fields pass through: the display cannot invent properties
    if (updates.title !== undefined) {
      todo.title = updates.title;
    }
    if (updates.description !== undefined) {
      todo.description = updates.description;
    }
    if (updates.note !== undefined) {
      todo.note = updates.note;
    }
    if (updates.priority !== undefined) {
      todo.priority = updates.priority;
    }
    if (updates.dueDate !== undefined) {
      todo.dueDate = updates.dueDate;
    }
    return todo;
  };

const addProject = (name) => {
    const nameTaken = projects.some((project) => project.name === name);
    if (nameTaken) {
      return null;
    }
    const project = createProject(name);
    projects.push(project);
    return project;
  };
const addTodo = (projectId, todoData) => {
  const project = getProjectById(projectId);

  if (project === null) {
    return null;
  }

  const todo = new Todo(
    todoData.title,
    todoData.description,
    todoData.dueDate,
todoData.priority,
    todoData.note ?? "",
    todoData.checklist ?? null
  );

  project.todos.push(todo);
  return todo;
};

  return {
getProjects,
    setProjects,
    getProjectById,
    addProject,
    addTodo,
    toggleTodo,
deleteTodo,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    updateTodo
  };
})();


export { projectsManager };
