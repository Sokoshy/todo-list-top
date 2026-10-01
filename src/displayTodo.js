import { projectsManager } from "./projects-manager.js";

let currentProjectId = projectsManager.getProjects()[0].id;

const formatDate = (date) => {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const renderTodoItem = (todo) => {
  const li = document.createElement("li");
  li.classList.add("todo-item", `priority-${todo.priority}`);

  // Not displayed, but this is what binds the line to the object in the store
  li.dataset.todoId = todo.id;

  // Why a checkbox even without a checklist: a todo is its own box to tick
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todo-checkbox");
  checkbox.checked = todo.isDone();
  checkbox.dataset.action = "toggle";

  const title = document.createElement("span");
  title.classList.add("todo-title");
  title.textContent = todo.title;
  title.dataset.action = "expand";

  if (todo.isDone()) {
    title.classList.add("is-done");
  }

  const dueDate = document.createElement("span");
  dueDate.classList.add("todo-due-date");
  dueDate.textContent = formatDate(todo.dueDate);

  const priority = document.createElement("span");
  priority.classList.add("todo-priority");
  priority.textContent = todo.priority;

  li.append(checkbox, title, dueDate, priority);

  // Notes stay collapsed in the list, they unfold in the detail dialog
  if (todo.note) {
    const note = document.createElement("p");
    note.classList.add("todo-note");
    note.textContent = todo.note;
    li.append(note);
  }

  return li;
};

const renderTodos = () => {
  const list = document.querySelector("[data-todo-list]");
  list.textContent = "";

  const project = projectsManager.getProjectById(currentProjectId);
  if (project === null) {
    return;
  }

  document.querySelector("[data-current-project]").textContent = project.name;
  document.querySelector("[data-todo-count]").textContent = `${project.todos.length} todo(s)`;

  project.todos.forEach((todo) => {
    list.appendChild(renderTodoItem(todo));
  });
};

const renderProjects = () => {
  const list = document.querySelector("[data-project-list]");
  list.textContent = "";

  projectsManager.getProjects().forEach((project) => {
    const li = document.createElement("li");
    li.classList.add("project-item");
    li.dataset.projectId = project.id;
    li.dataset.action = "select";

    if (project.id === currentProjectId) {
      li.classList.add("is-selected");
    }

    const name = document.createElement("span");
    name.textContent = project.name;

    const count = document.createElement("span");
    count.classList.add("project-count");
    count.textContent = project.todos.length;

    li.append(name, count);
    list.appendChild(li);
  });
};

const render = () => {
  renderProjects();
  renderTodos();
};

const setCurrentProjectId = (projectId) => {
  currentProjectId = projectId;
};

const getCurrentProjectId = () => {
return currentProjectId;
};

const openTodoDialog = (todo) => {
  const dialog = document.querySelector("[data-todo-dialog]");
  dialog.dataset.todoId = todo.id;

  document.querySelector("[data-dialog-title]").textContent = todo.title;
  document.querySelector("[data-dialog-description]").textContent = todo.description;
  document.querySelector("[data-dialog-due-date]").textContent = `Échéance : ${formatDate(todo.dueDate)}`;
  document.querySelector("[data-dialog-priority]").textContent = `Priorité : ${todo.priority}`;

  dialog.showModal();
};

export { render, renderProjects, renderTodos, setCurrentProjectId, getCurrentProjectId, openTodoDialog };