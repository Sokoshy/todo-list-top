import { createProject } from "./project.js";

const projectsManager = (() => {
  const projects = [];
  const defaultProject = createProject("Default");

  projects.push(defaultProject);

  const getProjects = () => projects;
  return {
    getProjects
  };
})();

export { projectsManager };
