import path from "node:path";
import {
  PROJECT_MANIFEST_FILENAME,
  WORKSPACE_CONFIG_FILENAME,
} from "./constants.js";
import { loadJsoncPipeline } from "./pipeline.js";
import {
  projectManifestSchema,
  workspaceConfigSchema,
  type ProjectManifestRaw,
  type WorkspaceConfigRaw,
} from "./schemas.js";

export type WorkspaceConfig = {
  schemaVersion: string;
  /** Absolute workspace root used when the config was loaded. */
  root: string;
  products?: Record<string, unknown>;
  plugins?: string[];
  projects?: string[];
};

export type ProjectManifest = {
  schemaVersion: string;
  /** Absolute project root used when the manifest was loaded. */
  root: string;
  targets?: string[];
  tooling?: string[];
};

function normalizeStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter((v): v is string => typeof v === "string" && v.length > 0);
  return items.length > 0 ? items : undefined;
}

function normalizeWorkspaceConfig(
  raw: Record<string, unknown>,
  root: string,
): WorkspaceConfig {
  const cfg: WorkspaceConfig = {
    schemaVersion: String(raw.schemaVersion),
    root: path.resolve(root),
  };
  if (raw.products && typeof raw.products === "object" && !Array.isArray(raw.products)) {
    cfg.products = raw.products as Record<string, unknown>;
  }
  const plugins = normalizeStringList(raw.plugins);
  if (plugins) {
    cfg.plugins = plugins;
  }
  const projects = normalizeStringList(raw.projects);
  if (projects) {
    cfg.projects = projects;
  }
  return cfg;
}

function normalizeProjectManifest(
  raw: Record<string, unknown>,
  root: string,
): ProjectManifest {
  const manifest: ProjectManifest = {
    schemaVersion: String(raw.schemaVersion),
    root: path.resolve(root),
  };
  const targets = normalizeStringList(raw.targets);
  if (targets) {
    manifest.targets = targets;
  }
  const tooling = normalizeStringList(raw.tooling);
  if (tooling) {
    manifest.tooling = tooling;
  }
  return manifest;
}

export async function loadWorkspaceConfig(cwd: string): Promise<WorkspaceConfig> {
  const root = path.resolve(cwd);
  const filePath = path.join(root, WORKSPACE_CONFIG_FILENAME);
  const validated = await loadJsoncPipeline(filePath, workspaceConfigSchema);
  return normalizeWorkspaceConfig(validated as WorkspaceConfigRaw, root);
}

export async function loadProjectManifest(projectRoot: string): Promise<ProjectManifest> {
  const root = path.resolve(projectRoot);
  const filePath = path.join(root, PROJECT_MANIFEST_FILENAME);
  const validated = await loadJsoncPipeline(filePath, projectManifestSchema);
  return normalizeProjectManifest(validated as ProjectManifestRaw, root);
}
