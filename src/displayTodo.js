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

  // Progress badge when a checklist exists: clickable, opens the detail dialog
  if (todo.checklist !== null) {
    const checked = todo.checklist.filter((item) => item.done).length;
    const badge = document.createElement("span");
    badge.classList.add("todo-checklist-badge");
    badge.textContent = `☑ ${checked}/${todo.checklist.length}`;
    badge.dataset.action = "expand";
    li.append(badge);
  }

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

const toInputDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const renderChecklist = (todo) => {
  const list = document.querySelector("[data-checklist-list]");
  list.textContent = "";

  if (todo.checklist === null) {
    const empty = document.createElement("li");
    empty.classList.add("checklist-empty");
    empty.textContent = "Pas de checklist pour cette todo.";
    list.appendChild(empty);
    return;
  }

  todo.checklist.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("checklist-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.dataset.action = "toggle-checklist-item";
    checkbox.dataset.checklistIndex = index;

    const label = document.createElement("span");
    label.textContent = item.texte;
    if (item.done) {
      label.classList.add("is-done");
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.dataset.action = "delete-checklist-item";
    remove.dataset.checklistIndex = index;

    li.append(checkbox, label, remove);
    list.appendChild(li);
  });
};

const openTodoDialog = (todo) => {
  const dialog = document.querySelector("[data-todo-dialog]");
  dialog.dataset.todoId = todo.id;

  document.querySelector("[data-dialog-title]").textContent = todo.title;
  document.querySelector("[data-dialog-description]").textContent = todo.description;
  document.querySelector("[data-dialog-due-date]").textContent = `Échéance : ${formatDate(todo.dueDate)}`;
  document.querySelector("[data-dialog-priority]").textContent = `Priorité : ${todo.priority}`;
  document.querySelector("[data-dialog-note]").textContent = todo.note ? `Note : ${todo.note}` : "";

  // Prefill the edit form with the current values
  document.querySelector("[data-edit-title]").value = todo.title;
  document.querySelector("[data-edit-description]").value = todo.description;
  document.querySelector("[data-edit-note]").value = todo.note;
  document.querySelector("[data-edit-due-date]").value = toInputDate(todo.dueDate);
  document.querySelector("[data-edit-priority]").value = todo.priority;

  renderChecklist(todo);

  // Already open (refresh after an edit): keep it open instead of throwing
  if (!dialog.open) {
    dialog.showModal();
  }
};

export { render, renderProjects, renderTodos, setCurrentProjectId, getCurrentProjectId, openTodoDialog };