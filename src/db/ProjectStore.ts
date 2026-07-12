// src/db/ProjectStore.ts

export interface Project {
  id: string | number;
  input: string;
  files: any[];
  name?: string;
  created_at?: string;
}

export function saveProject(project: Project): void {
  try {
    const projects = loadProjects();
    const index = projects.findIndex((p) => String(p.id) === String(project.id));
    if (index >= 0) {
      projects[index] = { ...projects[index], ...project };
    } else {
      projects.push(project);
    }
    localStorage.setItem("mamta_projects", JSON.stringify(projects));
    console.log("💾 [ProjectStore] Successfully saved project:", project);
  } catch (err) {
    console.error("❌ [ProjectStore] LocalStorage write error:", err);
  }
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem("mamta_projects");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ [ProjectStore] LocalStorage read error:", err);
    return [];
  }
}
