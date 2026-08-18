import { Command } from "commander";
export function createCli(options) {
    const program = new Command();
    program
        .name(options.name)
        .description(options.description ?? "")
        .version(options.version);
    return program;
}
export async function loadWorkspaceConfig(cwd) {
    void cwd;
    return { schemaVersion: "0" };
}
export async function loadProjectManifest(projectRoot) {
    void projectRoot;
    return { schemaVersion: "0" };
}
export async function discoverProjects(_config) {
    return [];
}
export async function loadPlugins(_config) {
    return [];
}
export async function doctor(cwd) {
    return [
        {
            code: "kernel.stub",
            message: `doctor stub ok (cwd=${cwd}). Real checks land in a later milestone.`,
            severity: "info",
        },
    ];
}
