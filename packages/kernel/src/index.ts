import { Command } from "commander";

export type CreateCliOptions = {
  name: string;
  version: string;
  description?: string;
};

export function createCli(options: CreateCliOptions): Command {
  const program = new Command();
  program
    .name(options.name)
    .description(options.description ?? "")
    .version(options.version);
  return program;
}

export type WorkspaceConfig = {
  schemaVersion: string;
  products?: Record<string, unknown>;
  plugins?: string[];
};

export type ProjectManifest = {
  schemaVersion: string;
  targets?: string[];
  tooling?: string[];
};

export async function loadWorkspaceConfig(cwd: string): Promise<WorkspaceConfig> {
  void cwd;
  return { schemaVersion: "0" };
}

export async function loadProjectManifest(projectRoot: string): Promise<ProjectManifest> {
  void projectRoot;
  return { schemaVersion: "0" };
}

export async function discoverProjects(_config: WorkspaceConfig): Promise<string[]> {
  return [];
}

export type PluginRecord = {
  name: string;
  version?: string;
};

export async function loadPlugins(_config: WorkspaceConfig): Promise<PluginRecord[]> {
  return [];
}

export type DoctorFinding = {
  code: string;
  message: string;
  severity: "info" | "warn" | "error";
};

export async function doctor(cwd: string): Promise<DoctorFinding[]> {
  return [
    {
      code: "kernel.stub",
      message: `doctor stub ok (cwd=${cwd}). Real checks land in a later milestone.`,
      severity: "info",
    },
  ];
}
