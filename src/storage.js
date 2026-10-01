import { Todo } from "./todo.js";
import { createProject } from "./project.js";
import { projectsManager } from "./projects-manager.js";

const STORAGE_KEY = "todo-list-top";

// Why a module of its own: JSON keeps the text but not the behavior,
// so saving and rebuilding are one job, kept away from both store and display.
const saveProjects = () => {
  const data = JSON.stringify(projectsManager.getProjects());
  localStorage.setItem(STORAGE_KEY, data);
};

// Plain object from the drawer -> real Todo again, with its methods back
const reviveTodo = (plain) => {
  const todo = new Todo(
    plain.title,
    plain.description,
    new Date(plain.dueDate),
    plain.priority,
    plain.note,
    plain.checklist,
    plain.done
  );
  todo.id = plain.id;
  return todo;
};

const reviveProject = (plain) => {
  const project = createProject(plain.name);
  project.id = plain.id;
  plain.todos.forEach((item) => {
    project.todos.push(reviveTodo(item));
  });
  return project;
};

const loadProjects = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  // First run ever: nothing saved yet, keep the default project
  if (raw === null) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    // Corrupted or wiped data: keep the current state instead of crashing
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    projectsManager.setProjects(parsed.map(reviveProject));
  } catch {
    return;
  }
};

export { saveProjects, loadProjects };