import { Command } from "commander";
export type CreateCliOptions = {
    name: string;
    version: string;
    description?: string;
};
export declare function createCli(options: CreateCliOptions): Command;
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
export declare function loadWorkspaceConfig(cwd: string): Promise<WorkspaceConfig>;
export declare function loadProjectManifest(projectRoot: string): Promise<ProjectManifest>;
export declare function discoverProjects(_config: WorkspaceConfig): Promise<string[]>;
export type PluginRecord = {
    name: string;
    version?: string;
};
export declare function loadPlugins(_config: WorkspaceConfig): Promise<PluginRecord[]>;
export type DoctorFinding = {
    code: string;
    message: string;
    severity: "info" | "warn" | "error";
};
export declare function doctor(cwd: string): Promise<DoctorFinding[]>;
