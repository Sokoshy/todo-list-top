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
    addTodo
  };
})();


export { projectsManager };
