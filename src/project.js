export function createProject(name) {
  return {
    id: crypto.randomUUID(),
    name: name,
    todos: [],
  };
}
