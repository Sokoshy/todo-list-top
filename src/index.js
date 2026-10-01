import "./style.css";
import { projectsManager } from "./projects-manager.js";
import { render, setCurrentProjectId, getCurrentProjectId, openTodoDialog } from "./displayTodo.js";
import { saveProjects, loadProjects } from "./storage.js";

const projectForm = document.querySelector("[data-project-form]");
const todoForm = document.querySelector("[data-todo-form]");
const projectList = document.querySelector("[data-project-list]");
const todoList = document.querySelector("[data-todo-list]");

// Which project the main column is showing. Lives here, not in the store,
// because "what is on screen" is a display concern, not a data concern.
// Which project the main column is showing lives in displayTodo.js: what is on
// screen is a display concern, so it stays with the display, not with the store.

const findTodo = (todoId) => {
  const project = projectsManager.getProjectById(getCurrentProjectId());
  return project.todos.find((todo) => todo.id === todoId);
};

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(projectForm);
  const project = projectsManager.addProject(data.get("projectName").trim());

  if (project === null) {
    alert("Ce projet existe déjà.");
    return;
  }

  projectForm.reset();
  setCurrentProjectId(project.id);
  saveProjects();
  render();
});

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(todoForm);
  projectsManager.addTodo(getCurrentProjectId(), {
    title: data.get("title").trim(),
    description: data.get("description").trim(),
    // The input gives "2026-10-05", which is not a Date: build one from the string
    dueDate: data.get("dueDate") ? new Date(data.get("dueDate")) : new Date(),
    priority: data.get("priority"),
  });

  todoForm.reset();
  saveProjects();
  render();
});

projectList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-project-id]");
  if (!item) {
    return;
  }

  setCurrentProjectId(item.dataset.projectId);
  render();
});

todoList.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const todoId = event.target.closest("[data-todo-id]")?.dataset.todoId;

  if (!action || !todoId) {
    return;
  }

  if (action === "toggle") {
    projectsManager.toggleTodo(getCurrentProjectId(), todoId);
    saveProjects();
  }

  if (action === "expand") {
    openTodoDialog(findTodo(todoId));
  }

  render();
});

const todoDialog = document.querySelector("[data-todo-dialog]");

todoDialog.addEventListener("click", (event) => {
  if (event.target.dataset.action !== "delete") {
    return;
  }

  projectsManager.deleteTodo(getCurrentProjectId(), todoDialog.dataset.todoId);
  saveProjects();
  todoDialog.close();
  render();
});
// Rebuild real Todos from storage before the first render. After load,
// the shown project may be a revived one, no longer the initial default.
loadProjects();

if (projectsManager.getProjectById(getCurrentProjectId()) === null) {
  setCurrentProjectId(projectsManager.getProjects()[0].id);
}
render();