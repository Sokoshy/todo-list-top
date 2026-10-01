import { createProject } from "./project.js";
import { Todo } from "./todo.js";

const projectsManager = (() => {
  const projects = [];
  const defaultProject = createProject("Default");

  projects.push(defaultProject);

  const getProjects = () => projects;

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
  );

  project.todos.push(todo);
  return todo;
};

  return {
    getProjects,
    getProjectById,
    addProject,
    addTodo,
    toggleTodo,
deleteTodo
  };
})();


export { projectsManager };
