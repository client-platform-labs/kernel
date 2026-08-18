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

export {
  WORKSPACE_CONFIG_FILENAME,
  PROJECT_MANIFEST_FILENAME,
  SUPPORTED_SCHEMA_VERSIONS,
  CURRENT_SCHEMA_VERSION,
} from "./constants.js";
export { ConfigError } from "./pipeline.js";
export {
  loadWorkspaceConfig,
  loadProjectManifest,
  type WorkspaceConfig,
  type ProjectManifest,
} from "./config.js";
export { discoverProjects } from "./discover.js";
export { loadPlugins, type PluginRecord } from "./plugins.js";
export { doctor, type DoctorFinding } from "./doctor.js";
