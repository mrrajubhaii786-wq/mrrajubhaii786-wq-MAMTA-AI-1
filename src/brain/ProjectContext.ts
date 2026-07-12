// src/brain/ProjectContext.ts

export interface ProjectData {
  id: string;
  name: string;
  goal: string;
  status: string;
  created_at: string;
  tasks?: any[];
}

export class ProjectContext {
  private currentProject: ProjectData | null = null;

  public set(project: ProjectData) {
    this.currentProject = project;
    console.log(`🌐 [ProjectContext] Switched current workspace context to project: ${project.name} (${project.id})`);
  }

  public get(): ProjectData | null {
    return this.currentProject;
  }

  public clear() {
    this.currentProject = null;
  }
}

export const projectContext = new ProjectContext();
